from _ast import List

from lib.Serializable import Serializable


class Prediction(Serializable):
    gene: int
    score: int

    def __init__(self, gene, score):
        self.gene = gene
        self.score = score

    def __str__(self):
        return f'{self.gene}: {self.score}'

    def serialize(self):
        return f'{self.gene}|{self.score}'
        pass

    def header(self):
        pass

    def type(self):
        pass


class DiseasePredictions(Serializable):
    disease: int
    prediction = []

    def __init__(self, disease: int):
        self.disease = disease

    def __str__(self):
        return f'{self.disease}: {self.prediction}'

    def is_multi_item(self):
        return True

    def serialize(self):
        prediction_string_list = []
        for pred_instance in self.prediction:
            prediction_string_list.append(f"{self.disease}|{pred_instance.serialize()}")
        return prediction_string_list

    def header(self):
        return 'disease:START_ID(PHENOTYPE)|gene:END_ID(GENE)|score:FLOAT'

    def type(self):
        return f'PREDICTED_INTERACTION'

    def push_prediction(self, prediction: Prediction):
        self.prediction.append(prediction)


class Cardigan(object):

    cardigan_content = []

    def __init__(self, cardigan_filename):
        with open(cardigan_filename) as f:
            self.cardigan_content = f.readlines()

    def get_predictions(self):
        predictions = []
        for f in self.cardigan_content:
            if not f.startswith('#'):
                line = f.rstrip().split('\t')
                text_predictions = line[2].split('|')
                f_predictions = []
                for text_prediction in text_predictions:
                    sep_text_prediction = text_prediction.split(',')
                    f_predictions.append(Prediction(sep_text_prediction[0], sep_text_prediction[1]))
                disease_predictions = DiseasePredictions(int(line[0]))
                disease_predictions.prediction = f_predictions
                predictions.append(disease_predictions)
        return predictions
