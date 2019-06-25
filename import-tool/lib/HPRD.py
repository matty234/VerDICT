from lib.Serializable import Serializable


class Interaction(Serializable):
    interactor: int
    interactee: int

    def __init__(self, interactor, interactee):
        self.interactor = interactor  # 1
        self.interactee = interactee  # 2

    def header(self):
        return "geneinteractor:START_ID(GENE)|geneinteractee:END_ID(GENE)"

    def type(self):
        return "INTERACTS_WITH"

    def serialize(self):
        return f"{self.interactor}|{self.interactee}"

class HPRD(object):
    hugo_dict = {}
    hugo_alias_dict = {}
    hugo_official_dict = {}

    def __init__(self, hugo_file, hprd_file):
        with open(hugo_file) as f:
            self.hugo_lines = f.readlines()
        with open(hprd_file) as f:
            self.hprd_lines = f.readlines()

        self.build_hugo_dict()

    def build_hugo_dict(self):
        for i in self.hugo_lines:
            if not i.startswith('#'):
                hugo_line = i.split('\t')
                entrez_id = hugo_line[3].rstrip()
                if not len(hugo_line[0]) == 0:
                    self.hugo_dict[hugo_line[0]] = entrez_id
                if not len(hugo_line[1]) == 0:
                    self.hugo_alias_dict[hugo_line[1]] = entrez_id
                if not len(hugo_line[2]) == 0:
                    self.hugo_alias_dict[hugo_line[2]] = entrez_id

    def get_hprd(self):
        ppi_map = []
        for i in self.hprd_lines:
            if not i.startswith('#'):
                hugo_line = i.split('\t')

                interactor: int = -1
                interactee: int = -1

                if hugo_line[0] in self.hugo_dict:
                    interactor = self.hugo_dict[hugo_line[0]]
                elif hugo_line[0] in self.hugo_alias_dict:
                    interactor = self.hugo_alias_dict[hugo_line[0]]
                elif hugo_line[0] in self.hugo_official_dict:
                    interactor = self.hugo_official_dict[hugo_line[0]]
                else:
                    print(f"Cannot find {hugo_line[0]} in HUGO translation")

                if hugo_line[3] in self.hugo_dict:
                    interactee = self.hugo_dict[hugo_line[3]]
                elif hugo_line[3] in self.hugo_alias_dict:
                    interactee = self.hugo_alias_dict[hugo_line[3]]
                elif hugo_line[3] in self.hugo_official_dict:
                    interactee = self.hugo_official_dict[hugo_line[3]]
                else:
                    print(f"Cannot find {hugo_line[3]} in HUGO translation")

                if not interactor == -1 and not interactee == -1:
                    ppi_map.append(Interaction(interactor, interactee))
        return ppi_map