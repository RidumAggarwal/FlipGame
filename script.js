const gameBoard = document.getElementById('game-board')
const numbers = document.querySelectorAll('.num')
const startButton = document.getElementById('start-btn')
const startpage = document.getElementById('start-game')
const username = document.getElementById('user-name')
const userid = document.getElementById('user-id')
const displayname = document.getElementById('display-username')
const displayid = document.getElementById('display-userid')
const displayHS = document.getElementById('display-highscore')
const displayBS = document.getElementById('display-bestscore')
const timebar= document.getElementById('timebar');
let first = null
let width=0;
let score = 0
let scoretemp = 0
let userIds = {}
let firstclick = false
let bestScore
let userName
let userId
updateNumber()
// Event Listener below
startButton.addEventListener('click', startGame)
gameBoard.addEventListener('click', e => {
  if (e.target.classList.contains('box')) {
    if (firstclick === false) {
      startTimer()
      firstclick = true
      document.getElementById('score').innerHTML = `Score:${score}`
    }
    var ele = e.target.childNodes[0]

    if (ele.classList.contains('hide')) {
      ele.classList.remove('hide')
      setTimeout(() => {
        if (first === null) {
          first = ele
        } else {
          if (first.innerText === ele.innerText && first !== ele) {
            first = null
            updateScore()
          } else {
            ele.classList.add('hide')
            first.classList.add('hide')
            first = null
          }
        }
      }, 150)
    }
  }
})

// Functions below
function startGame () {
  userName = username.value
  userId = userid.value
  if (!userName || !userId) {
    alert('Please enter a valid user name and ID')
    return
  }
  if (!localStorage.getItem('userIds')) {
    localStorage.setItem('userIds', JSON.stringify(userIds))
  } else {
    userIds = JSON.parse(localStorage.getItem('userIds'))
  }
  if (!userIds.hasOwnProperty(userId)) {
    userIds[userId] = {
      name: userName,
      allScores: {},
      highScore: 0
    }
    localStorage.setItem('userIds', JSON.stringify(userIds))
    updateScores()
    startpage.style.display = 'none'
  } else if (userIds[userId].name == userName) {
    updateScores()
    startpage.style.display = 'none'
  } else {
    alert('User Id present with different username')
  }
}
function updateNumber () {
  let allNumbers = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8]
  numbers.forEach(element => {
    let i = Math.floor(Math.random() * allNumbers.length)
    element.innerHTML = allNumbers[i]
    allNumbers.splice(i, 1)
  })
}
function updateGameBoard () {
  numbers.forEach(elm => {
    elm.classList.add('hide')
  })
}
function updateScore () {
  score++
  scoretemp++
  document.getElementById('score').innerHTML = `Score:${score}`
}
function startTimer () {
  let time = 60
  let timer = setInterval(function () {
    time--
    document.getElementById('timer').innerHTML = ''
    if (time < 10) {
      document.getElementById('timer').innerHTML = `00:0${time}`
    } else document.getElementById('timer').innerHTML = `00:${time}`
    
    width+=100/60
    timebar.style.width=`${width}%`
    if (scoretemp === 8) {
      scoretemp = 0
      updateGameBoard()
      updateNumber()
    }
    if (time <= 0) {
      recordScore()
      updateGameBoard()
      updateNumber()
      updateScores()
      alert('Time is over')
      score = 0
      scoretemp = 0
      firstclick = false
      clearInterval(timer)
    }
  }, 1000)
}

function recordScore () {
  userIds[userId].allScores[Date.now()] = score
  if (score > userIds[userId].highScore) {
    userIds[userId].highScore = score
  }
  if (score > localStorage.getItem('bestScore')) {
    localStorage.setItem('bestScore', score)
  }
  localStorage.setItem('userIds', JSON.stringify(userIds))
}
function updateScores () {
  displayname.innerText = userName
  displayid.innerHTML = `<strong>UserId: </strong><u>${userId}</u>`
  displayHS.innerText = `User High Score: ${userIds[userId].highScore}`
  if (!localStorage.getItem('bestScore')) {
    bestScore = 0
  } else {
    bestScore = localStorage.getItem('bestScore')
  }
  displayBS.innerText = `Global Best Score: ${bestScore}`
}
