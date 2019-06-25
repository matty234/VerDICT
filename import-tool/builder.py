# CARDIGAN
# cd cardigan; tail -n+2 dt2.txt| python ./split-to-lines.py  > ../nov15/disease-cardigan-gene.txt; cd ..
# import sys

# for line in sys.stdin:
# 	disease = str(line).split('\t')[0]
# 	prots = str(line).split('\t')[2].split('|')
# 	for protein in prots:
# 		print(disease.rstrip() + '|' + protein.rstrip() + '|PREDICTED_INTERACTION')
# 		pass
# 	pass


# cut -d'|' -f1 diseases.nodes.txt | python build-entrez-morbidmap.py > ../nov15/disease-morbidmap-gene.txt
# import sys
# from collections import defaultdict
#
# FORMATTED_MORBID_MAP_FILE = './morbidmap-omimdisease-omimgene.txt'
# MIM_TO_GENE = './mim2gene.txt'
#
# #
# #	Expects OMIM disease identifiers from stdin which are then mapped to `morbidmap.txt`
# # 	where the entrez ID is found from mim2gene
# #
#
# mimtogene = {}
#
# with open(MIM_TO_GENE, "rb") as mimToGenePSV:
# 	for line in mimToGenePSV:
# 		fields = line.split('\t')
# 		if(len(fields) > 1
# 			and fields[1] == 'gene'
# 			and fields[2] != ''):
# 			mimtogene[fields[0].rstrip()] = fields[2].rstrip()
# 	mimToGenePSV.close()
#
# morbidmap = defaultdict(list)
#
# with open(FORMATTED_MORBID_MAP_FILE, "rb") as morbidmapPSV:
# 	for line in morbidmapPSV:
# 		fields = line.split('|')
# 		if(len(fields) > 1 and fields[1].rstrip() in mimtogene):
# 			morbidmap[fields[0]].append(mimtogene[fields[1].rstrip()])
# 	morbidmapPSV.close()
#
# for diseaseomim in sys.stdin:
# 	formattedDiseaseOmim = str(diseaseomim).rstrip()
# 	for relatedgenes in morbidmap[formattedDiseaseOmim]:
# 		print(formattedDiseaseOmim+ '|' + relatedgenes + '|'+'HAS_GENE')
# 		pass
# 	pass


from pathlib import Path

from lib.DiseaseSimilarity import DiseaseSimilarity
from lib.Hugo import Hugo
from lib.OMIM import OMIM
from lib.FileUtilities import FileUtilities
from lib.Cardigan import Cardigan
from lib.PPI import PPI
from lib.HPRD import HPRD

OUTPUT_DIR = Path('output')

OMIM_MIMTITLES = Path('input/omim/mimTitles.txt')
OMIM_MORBIDMAP = Path('input/omim/morbidmap.txt')
OMIM_MIM2GENE = Path('input/omim/mim2gene.txt')

CARDIGAN_PREDICTIONS = Path('input/cardigan/weighted_predictions.txt')

BIOGRID_PPI = Path('input/biogrid/ppi.txt')

HUGO_GENES = Path('input/hugo/genes-with-ncbi-mapping.txt')

HPRD_PPI = Path('input/hprd/BINARY_PROTEIN_PROTEIN_INTERACTIONS.txt')

CANIZA_SIMILARITY = Path('input/caniza/combined_similarity_triplet.tsv')


abnormal_omim_entries = [616902]


if __name__ == '__main__':

    fileUtils = FileUtilities()

    hugo = Hugo(HUGO_GENES)
    omim = OMIM(OMIM_MIMTITLES, OMIM_MORBIDMAP, OMIM_MIM2GENE)
    cardigan = Cardigan(CARDIGAN_PREDICTIONS)
    # biogrid = PPI(BIOGRID_PPI)
    disease_sim = DiseaseSimilarity(CANIZA_SIMILARITY)
    hprd = HPRD(HUGO_GENES, HPRD_PPI)

    fileUtils.write_nodes(hugo.get_genes(), OUTPUT_DIR.joinpath('gene.nodes.txt').open('w+'))

    fileUtils.write_nodes(omim.get_phenotypes(), OUTPUT_DIR.joinpath('disease.nodes.txt').open('w+'))

    fileUtils.json_write_nodes(omim.get_phenotypes(), OUTPUT_DIR.joinpath('disease.nodes.json').open('w+'))

    fileUtils.json_write_nodes(hugo.get_genes(), OUTPUT_DIR.joinpath('gene.nodes.json').open('w+'))

    fileUtils.write_relationships(omim.get_morbidmap_associations(), OUTPUT_DIR.joinpath('disease-morbidmap-gene.txt').open('w+'))

    fileUtils.write_relationships(cardigan.get_predictions(), OUTPUT_DIR.joinpath('disease-cardigan-gene.txt').open('w+'))

    # fileUtils.write_relationships(biogrid.get_values(), OUTPUT_DIR.joinpath('gene-interacts-gene.txt').open('w+'))

    fileUtils.write_relationships(hprd.get_hprd(), OUTPUT_DIR.joinpath('gene-interacts-gene.txt').open('w+'))

    fileUtils.write_relationships(disease_sim.get_similarity(), OUTPUT_DIR.joinpath('disease-sim-disease.txt').open('w+'))
