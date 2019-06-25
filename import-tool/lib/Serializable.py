from abc import ABC, abstractmethod


class Serializable(ABC):
    @abstractmethod
    def serialize(self):
        pass

    @abstractmethod
    def header(self):
        pass

    @abstractmethod
    def type(self):
        pass

    def is_multi_item(self):
        return False


class JSONSerializable(Serializable):
    @abstractmethod
    def serialize(self):
        pass

    @abstractmethod
    def type(self):
        pass
