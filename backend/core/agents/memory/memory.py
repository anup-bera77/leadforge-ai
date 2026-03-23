class AgentMemory:

    def __init__(self):
        self.variables = {}

    def set(self, key, value):
        self.variables[key] = value

    def get(self, key):
        return self.variables.get(key)

    def append(self, key, value):
        if key not in self.variables:
            self.variables[key] = []

        self.variables[key].append(value)