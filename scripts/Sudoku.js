(function() {
  const noop = () => {}
  const basicMode = {
    isSpecialCell: () => false,
    additionalCheck: noop,
  }

  const defaultOptions = {
    mode: basicMode,
    columnClassPrefix: 'column-',
    rowClassPrefix: 'row-',
    cellClass: 'cell',
    rowClass: 'row',
    lockedClass: 'locked',
    basicHighlight: 'basic-highlight',
    specialHighlight: 'special-highlight',
  }

  const keyUpListener = (event) => {
    if (event.target.value > 9) {
      event.target.value = event.target.value[1]
    }
    if (event.target.value < 1) {
      event.target.value = ''
    }
  }

  const toggleFocus = (event) => {
    const { target } = event
    if (target === document.activeElement) {
      target.blur()
      event.preventDefault()
    }
  }

  class Sudoku {
    constructor(elementId, options = {}) {
      this.gameElement = document.getElementById(elementId)
      this.options = Object.assign(defaultOptions, options)

      this.inputGrid = [
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
      ]

      this.drawGrid()
    }

    _keyDownListener(event) {
      const { keyCode } = event

      if (keyCode >= 37 && keyCode <= 40) {
        event.preventDefault()

        const { row, column } = event.target.dataset

        let nextRow = row
        let nextColumn = column

        switch (keyCode) {
          case 37: // LEFT
            if (column > 0) {
              nextColumn = parseInt(column) - 1
            } else {
              nextColumn = false
            }
            break;
          case 38: // UP
            if (row > 0) {
              nextRow = parseInt(row) - 1
            } else {
              nextRow = false
            }
            break;
          case 39: // RIGHT
            if (column < 8) {
              nextColumn = parseInt(column) + 1
            } else {
              nextColumn = false
            }
            break;
          case 40: // DOWN
            if (row < 8) {
              nextRow = parseInt(row) + 1
            } else {
              nextRow = false
            }
            break;
        }

        if (nextRow !== false && nextColumn !== false) {
          this.inputGrid[nextRow][nextColumn].focus()
        }
      } else if (keyCode === 46) {
        // DELETE
        event.target.value = ''
      }
    }

    drawGrid() {
      const keyDownListener = this._keyDownListener.bind(this)

      this.gameElement.innerHTML = ''

      for(let row = 0; row < 9; row++) {
        const rowDiv = document.createElement('div')

        for(let column = 0; column < 9; column++) {
          const input = document.createElement('input')

          const columnClasses = [
            this.options.columnClassPrefix + (column + 1),
            this.options.rowClassPrefix + (row + 1),
            this.options.cellClass,
          ]

          if ((Math.floor(row / 3) + Math.floor(column / 3)) % 2 === 1) {
            columnClasses.push(this.options.basicHighlight)
          }

          if (this.options.mode.isSpecialCell(row, column)) {
            columnClasses.push(this.options.specialHighlight)
          }

          input.className = columnClasses.join(' ')

          input.type = 'number'
          input.dataset.row = row
          input.dataset.column = column
          input.addEventListener('mousedown', toggleFocus)
          input.addEventListener('keydown', keyDownListener)
          input.addEventListener('keyup', keyUpListener)

          this.inputGrid[row][column] = input
          rowDiv.appendChild(input)
        }

        rowDiv.className = this.options.rowClass

        this.gameElement.append(rowDiv)
      }
    }

    check() {

      return basicCheck && this.options.mode.additionalCheck()
    }
  }

  window.Sudoku = Sudoku
})()