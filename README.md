# Minesweeper

Link to wireframes: [wireframes](Wireframes.PNG)

## Pseudocode

### Define required Constants

1. STATE object (0 for safe, 1 for bomb, 'F' for flag, 'Q' for question mark)

### Define required variables used to track the state of the game

1. visible board array
    1. dynamic dimensions based on user input, assume 10x10 grid if no input (subject to change)
    2. elements are objects containing value of the space, and how many spaces around given space that contain bombs (0 - 8)
2. 'hidden' board with values
    1. Use dimension input from 2.1.1
3. exploded variable to represent whether or not the user hit a bomb last turn (1 is bomb, 0 is safe)
4. difficulty (easy, medium, hard) that determines the ratio of bombs to safe cells, medium is default

### Store elements on the page that will be accessed in code more than once

1. Store the variable amount of elements that represent the squares on the page

### Upon loading the app should

1. Initialize the state variables
    1. Initialize the boards to 0s to represent clear board
    2. Prompt user for difficulty
    3. Initialize exploded to null
2. Render state variables to page
    1. Render the board
        1. Loop over hidden board, compare to visible board
            1. Use current index of iteration to access the mapped value from the board array
            2. Show number of surrounding bombs if more than 0, flag for 'f', question mark for 'q'
    2. Render a message
        1. If exploded = 1, then user hasn't exploded
        2. If user clicks a bomb, or exploded = -1, then render message that they exploded
            1. reveal board, map open spots to hidden boards, stopping when there's at least one bomb in the vicinity of a cell
        3. If user unconvers all non-bomb squares, they win
            1. visible (or hidden?) board array doesn't include 1 or 0
3. Wait for the user to click a cell

### Handle a player clicking a cell

1. Obtain index of square that was clicked
    1. Looping through cached square elements using a for loop and breaking out when the current square element equals the event objects target
    2. Check if they exploded
    3. if not, and sum of 8 surrounding squares is 0, then reveal all 9 squares
        1. repeat for surrounding squares til bombs are met
2. If player explodes, or board.includes returns false, then immeadiately return because the game is over
3. update board array with 0?