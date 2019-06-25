from lib.Serializable import Serializable


class Interaction(Serializable):
    id: int
    interactor: int
    interactee: int

    def __init__(self, id, interactor, interactee):
        self.id = id #0
        self.interactor = interactor #1
        self.interactee = interactee #2

    def header(self):
        return "id|geneinteractor:START_ID(GENE)|geneinteractee:END_ID(GENE)"

    def type(self):
        return "INTERACTS_WITH"

    def serialize(self):
        return f"{self.id}|{self.interactor}|{self.interactee}"

class PPI(object):
    ppi_values = []

    def __init__(self, ppi_filename):
        with open(ppi_filename) as f:
            self.ppi_values = f.readlines()

    def get_values(self):
        ppi_map = []
        for f in range(len(self.ppi_values)):
            if not self.ppi_values[f].startswith('#'):
                line = self.ppi_values[f].split('\t')
                ppi_map.append(Interaction(line[0], line[1], line[2]))
        return ppi_map
