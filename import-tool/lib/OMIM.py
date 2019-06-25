import re
from _ast import List
from lib.Serializable import Serializable, JSONSerializable
import json

morbidmap_pattern = re.compile("{?\??(?P<name>.+)}?,\ +(?P<id>[0-9]{6})", re.VERBOSE)


class Phenotype(JSONSerializable):
    name: List(str)
    omim: str

    def __init__(self, omim, name: List(str)):
        self.name = name
        self.omim = omim

    def __str__(self):
        return "Name: " + self.name + " OMIM: " + str(self.omim)

    def header(self):
        return "omim:ID(PHENOTYPE)|name"

    def type(self):
        return "PHENOTYPE"

    def serialize(self):
        return str(self.omim) + '|' + '\t'.join(self.name)

    def serializeJSON(self):
        return "{ \"index\":{ \"_index\": \"phenotype\", \"_type\": \"_doc\" } }\n{\"omim\":" + self.omim \
               + ",\"name\":" + json.dumps(self.name) + "}"




class MorbidMap(Serializable):
    phenotype: int
    gene: int

    def __init__(self, phenotype, gene):
        self.phenotype = phenotype
        self.gene = gene

    def header(self):
        return "disease:START_ID(PHENOTYPE)|gene:END_ID(GENE)"

    def type(self):
        return "HAS_GENE"

    def serialize(self):
        return str(self.phenotype) + '|' + str(self.gene)


class OMIM(object):
    mimtitles_content = []
    mimtitles = []

    morbidmap_content = []
    morbidmap = []

    mim2gene_content = []
    mim2gene = {}

    def __init__(self, mimtitle_filename, morbidmap_filename, mim2gene_filename):
        with open(mimtitle_filename) as f:
            self.mimtitles_content = f.readlines()

        with open(morbidmap_filename) as f:
            self.morbidmap_content = f.readlines()

        with open(mim2gene_filename) as f:
            self.mim2gene_content = f.readlines()

        self.get_mim2gene()
        self.get_mimtitles()
        self.get_morbidmap()

    def get_mim2gene(self):
        for f in range(len(self.mim2gene_content)):
            if not self.mim2gene_content[f].startswith('#'):
                mim2geneline = self.mim2gene_content[f].rstrip().split('\t')
                if len(mim2geneline) > 2 and mim2geneline[1] and 'gene' in mim2geneline[1]:
                    self.mim2gene[int(mim2geneline[0])] = int(mim2geneline[2])

    pass

    def get_mimtitles(self):
        for f in range(len(self.mimtitles_content)):
            if not self.mimtitles_content[f].startswith('#'):
                self.mimtitles.append(self.mimtitles_content[f].rstrip().split('\t'))

    pass

    def get_morbidmap(self):
        for f in range(len(self.morbidmap_content)):
            if not self.morbidmap_content[f].startswith('#'):
                self.morbidmap.append(self.morbidmap_content[f].rstrip().split('\t'))

    pass

    def get_phenotypes(self, ignore_deprecated=False):
        diseases: List[Phenotype] = []
        for f in range(len(self.mimtitles)):
            phenotype = self.mimtitles[f]
            if phenotype[0] == 'Number Sign' or phenotype[0] == 'Percent' or phenotype[0] == 'NULL':
                diseases.append(Phenotype(phenotype[1], phenotype[2:]))

        return diseases

    def get_morbidmap_associations(self):
        associations: List[tuple] = []
        for mapvalue in self.morbidmap:
            matches = morbidmap_pattern.match(mapvalue[0])
            if matches and int(mapvalue[2]) in self.mim2gene:
                associations.append(MorbidMap(int(matches.group('id')), self.mim2gene[int(mapvalue[2])]))
        return associations
