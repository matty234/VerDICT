from lib.Serializable import Serializable


class Similarity(Serializable):

    disease_a: int
    disease_b: int
    score: int

    def __init__(self, disease_a, disease_b, score):
        self.disease_a = disease_a
        self.disease_b = disease_b
        self.score = score

    def serialize(self):
        return f"{self.disease_a}|{self.disease_b}|{self.score}"

    def header(self):
        return f"omim1:START_ID(PHENOTYPE)|omim2:END_ID(PHENOTYPE)|score:FLOAT"

    def type(self):
        return "RELATED_TO"


class DiseaseSimilarity(object):

    def __init__(self, similarity_filename):
        with open(similarity_filename) as f:
            self.similarity_content = f.readlines()

    def get_similarity(self):
        similarities = []
        for line in self.similarity_content:
            if not line.startswith('#'):
                split_line = line.rstrip().split('\t')
                disease_a = split_line[0]
                disease_b = split_line[1]
                score = split_line[2]
                similarities.append(Similarity(disease_a, disease_b, score))
        return similarities