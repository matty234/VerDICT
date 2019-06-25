import os
from time import sleep
from typing import IO

from lib.Serializable import Serializable, JSONSerializable


class FileUtilities(object):

    def __init__(self):
        pass

    def write_nodes(self, list, output: IO):
        print(f'Writing {list[0].type()}')
        if isinstance(list[0], Serializable):
            output.write(f"{list[0].header()}|:LABEL\n")
            output.write("\n".join(map(lambda x: f"{x.serialize()}|{list[0].type()}", list)))

    def json_write_nodes(self, list, output: IO):
        print(f'Writing JSON {list[0].type()}')
        if isinstance(list[0], JSONSerializable):
            output.write("\n".join(map(lambda x: x.serializeJSON(), list)))
        output.write("\n")

    def write_relationships(self, list, output: IO):
        print(f'Writing {list[0].type()}')
        if isinstance(list[0], Serializable):
            output.write(f"{list[0].header()}|:TYPE\n")
            if list[0].is_multi_item():
                for p in range(len(list)):
                    for f in list[p].serialize():
                        output.write(f + '|' + list[0].type() + '\n')

            else:
                output.write("\n".join(map(lambda x: f"{x.serialize()}|{list[0].type()}", list)))
