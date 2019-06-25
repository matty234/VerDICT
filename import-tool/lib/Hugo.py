from _ast import Set

from lib.Serializable import Serializable, JSONSerializable


class Gene(JSONSerializable):
    def __init__(self, official_symbol, entrez_id):
        self.official_symbol = official_symbol
        self.entrez_id = entrez_id

    def header(self):
        return "entrez:ID(GENE)|official_symbol"

    def type(self):
        return "GENE"

    def serialize(self):
        return f"{self.entrez_id}|{self.official_symbol}"

    def serializeJSON(self):
        return "{ \"index\":{ \"_index\": \"gene\", \"_type\": \"_doc\" } }\n{\"entrez\":" + self.entrez_id \
               + ",\"official_symbol\":\"" + self.official_symbol + "\"}"

    def __eq__(self, other):
        return self.official_symbol == other.official_symbol

class Hugo(object):
    def __init__(self, cardigan_filename):
        with open(cardigan_filename) as f:
            self.gene_lines = f.readlines()

    def get_genes(self):
        genes = []
        for line in self.gene_lines:
            line_parts = line.split('\t')
            if not line.startswith('#') and len(line_parts) == 4:
                if len(line_parts[3].rstrip()) != 0:
                    genes.append(Gene(line_parts[0].rstrip(), line_parts[3].rstrip()))
                else:
                    print(f"No identifier for {line_parts[0].rstrip()}")
        return self._removeDuplicates(genes)

    def _removeDuplicates(self, listofElements):
        # Create an empty list to store unique elements
        uniqueList = []

        # Iterate over the original list and for each element
        # add it to uniqueList, if its not already there.
        for elem in listofElements:
            if elem not in uniqueList:
                uniqueList.append(elem)

        # Return the list of unique elements
        return uniqueList