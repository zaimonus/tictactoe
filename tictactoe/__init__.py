import numpy as numpy


class Game:

    def __init__(self, empty: str = ' ') -> None:
        super().__init__()
        self.__empty = empty
        self.__board = numpy.full((3, 3), empty, dtype=str)

    @property
    def empty_symbol(self):
        return self.__empty

    @property
    def board(self):
        return self.__board.copy()

    def grid(self):
        rows = []
        for row in self.board:
            line = []
            for item in row:
                line.append(item)
            rows.append(' | '.join(line))
        return '\n'.join(rows)

    def playable(self):
        return numpy.any(self.board == self.empty_symbol)

    def check(self, symbol, row, col):
        max_row, max_col = self.board.shape
        if 0 >= row or row > max_row or 0 >= col or col > max_col:
            raise IndexError
        if self.board[row - 1][col - 1] != self.empty_symbol:
            raise PermissionError
        self.__board[row - 1][col - 1] = symbol

    def win_row(self, symbol):
        return numpy.any(numpy.all(self.board == symbol, axis=1))

    def win_col(self, symbol):
        return numpy.any(numpy.all(self.board == symbol, axis=0))

    def win_diagonal(self, symbol):
        return numpy.all(numpy.diagonal(self.board) == symbol)

    def win_anti_diagonal(self, symbol):
        return numpy.all(numpy.diagonal(numpy.flip(self.board, axis=1) == symbol))

    def won(self, symbol):
        cond = [self.win_row, self.win_col, self.win_diagonal, self.win_anti_diagonal]
        return any(map(lambda f: f(symbol), cond))
