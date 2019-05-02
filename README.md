# Minesweeper!

Link to wireframes: [wireframes](wireframes.png)

## Pseudocode:
1) Define required Constants
    1.1) SQUARE_VALUES object (0 for safe, 1 for bomb, 'F' for flag, 'Q' for question mark)
2) Define required variables used to track the state of the game:
    2.1)visible board array
        2.1.1) dynamic dimensions based on user input, assume 10x10 if no input
            2.1.1.2) elemtent is value, sum of 8 surrounding elements?
    2.2)'hidden' board with values
        2.2.1) Use dimension input from 2.1.1 and 
    2.3)exploded variable to represent whether or not the user hit a bomb last turn (1 is bomb, 0 is safe)
    2.4) difficulty (easy medium hard) that determines the ratio of bombs to safe cells, assume medium if no input
3) Store elements on the page that will be accessed in code more than once
    3.1) Store the variable amount of elements that represent the squares on the page
4) Upon loading the app should:
    4.1) Initialize the state variables:
        4.1.1) Initialize the visible board to nulls to represent clear board
        4.1.2) Prompt user for difficulty and board size (offer presets), store
        4.1.3) initialize exploded to null cuz you ain't exploded
    4.2) Render state variables to page
        4.2.1) Render the board
            4.2.1.1) Loop over hidden board, compare to visible board  
                4.2.1.1.1) Use current index of iteration to access the mapped value from the board array
                4.2.1.1.2) Show number of surrounding bombs if more than 0, flag for 'f', question mark for 'q'
        4.2.2) Render a message:
            4.2.2.0) If exploded = 1, then user hasn't exploded
            4.2.2.1) If user clicks a bomb, or exploded = -1, then render message that they exploded
                4.2.2.1.1) reveal board, map visible board to hidden
            4.2.2.2) If user uncovers all non-bomb squares, congratulations
                4.2.2.2.1) visible board array doesn't include 1 or 0
    4.3) Wait for the user to click a squares
5) Handle a player clicking a square:
    5.1) Obtain index of square that was clicked:
        5.1.1) Looping through cached square elements using a for loop and breaking out when the current square element equals the event object's target.
        5.1.2) check if they exploded
        5.1.3) if not, and sum of 8 surrounding squares is 0, then reveal all 9 squares
            5.1.3.1) repeat for surrounding squares til we hit some bombs

    5.3) if explodes = 1 or board.includes(1 or 0) then immeadiately return because the game is over 
    5.4) Update board array with 0