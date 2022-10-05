from tictactoe import Game

symbol1 = input('Symbol for Player 1:')
symbol2 = input('Symbol for Player 2:')
turn1 = True
g = Game('_')

while g.playable() and (not g.won(symbol1)) and (not g.won(symbol2)):
    print(g.grid())
    print(f'It is your turn, Player {1 if turn1 else 2}.')
    index = input('Check at (row column): ')
    try:
        row, column = map(int, index.split())
        g.check(symbol1 if turn1 else symbol2, row, column)
        turn1 = not turn1
    except ValueError:
        print('Your input could not be parsed. Try again.')
    except IndexError:
        print('Your input values are out of bounds. Try again.')
    except PermissionError:
        print('This field is already checked. Try again.')

if g.won(symbol1):
    print('Player 1 has won the game.')
elif g.won(symbol2):
    print('Player 2 has won the game.')
else:
    print('Nobody won the game.')
print(g.grid())
