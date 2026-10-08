export const DIRECTIONS = ['上', '下', '左', '右'];

export const LOSE_MESSAGES = [
  '負け！あなたは「上」でも「下」でも「左」でも「右」でもない。機械の指示に従えない、標準のあなた。',
  '負け！方向感がなく、機械に先に目を合わせられない。お前、迷路内の塿人か？',
  '負け！あなたの選択は機械の方向から一回でも遅れた。ちょっとだけ、世界に合わせてきたら？',
  '負け！「上」「下」「左」「右」じゃないと、誰も信じない。あなたの判断はただのノイズ。',
  '負け！機械だけが正解を知っている。あなたはただされたら、もう一回、怒鳴りながら選べ。',
];

export function determineOutcome(playerChoice, machineChoice) {
  if (!DIRECTIONS.includes(playerChoice) || !DIRECTIONS.includes(machineChoice)) {
    throw new TypeError('選択肢は「上」「下」「左」「右」のいずれかです。');
  }

  return {
    playerChoice,
    result: playerChoice === machineChoice ? 'win' : 'lose',
  };
}

export function getRoundMessage(result, playerChoice, machineChoice) {
  if (result === 'win') {
    return `勝利！${playerChoice}を選んだあなた、機械の${machineChoice}に完全一致。絶対にドーパミン、世界中の方向があなたに合う！`;
  }

  const message = LOSE_MESSAGES[Math.floor(Math.random() * LOSE_MESSAGES.length)];
  return message.replaceAll('「上」', `「${playerChoice}」`).replaceAll('「下」', `「${machineChoice}」`);
}

function createConfetti(container, count = 220) {
  const colors = ['#ff4d6d', '#ffd166', '#7c3aed', '#22d3ee', '#fff', '#ff8a65'];
  for (let index = 0; index < count; index += 1) {
    const piece = document.createElement('span');
    piece.className = 'confetti';
    piece.style.setProperty('--x', `${Math.random() * 100}%`);
    piece.style.setProperty('--color', colors[index % colors.length]);
    piece.style.setProperty('--delay', `${Math.random() * 1.2}s`);
    piece.style.setProperty('--duration', `${2.5 + Math.random() * 2.4}s`);
    piece.style.setProperty('--rotate', `${Math.random() * 360}deg`);
    container.appendChild(piece);
  }
}

function createScreenBurst(container, text, className = 'screen-burst') {
  const burst = document.createElement('div');
  burst.className = className;
  burst.textContent = text;
  container.appendChild(burst);
  window.setTimeout(() => burst.remove(), 3800);
}

function createVictoryEffects(container) {
  createConfetti(container, 180);
  for (let index = 0; index < 8; index += 1) {
    const spark = document.createElement('span');
    spark.className = 'victory-spark';
    spark.style.setProperty('--angle', `${index * 45}deg`);
    container.appendChild(spark);
  }
  createScreenBurst(container, '強スギイイｲｲｲｲ!!!!!!!!!', 'screen-burst screen-burst-win screen-burst-win-main');
  createScreenBurst(container, 'Perfect Match!', 'screen-burst screen-burst-win screen-burst-win-secondary');
  createScreenBurst(container, 'えぐいて！', 'screen-burst screen-burst-title');
  document.body.classList.add('is-celebrating');
  window.setTimeout(() => document.body.classList.remove('is-celebrating'), 3800);
}

function createLoseEffects(container, playerChoice, machineChoice) {
  createScreenBurst(container, 'はい、負けw', 'screen-burst screen-burst-lose screen-burst-lose-main');
  createScreenBurst(container, `あなた:${playerChoice} / 機械:${machineChoice}`, 'screen-burst screen-burst-lose screen-burst-lose-detail');
  document.body.classList.add('is-lying');
  window.setTimeout(() => document.body.classList.remove('is-lying'), 3800);
}

function startGame() {
  const button = document.querySelector('#play-button');
  const choiceButtons = [...document.querySelectorAll('.choice')];
  const resultPanel = document.querySelector('#result-panel');
  const resultTitle = document.querySelector('#result-title');
  const resultCopy = document.querySelector('#result-copy');
  const machineDirection = document.querySelector('#machine-direction');
  const score = document.querySelector('#score');
  const effectLayer = document.querySelector('#effect-layer');
  const status = document.querySelector('#status');

  let wins = 0;
  let rounds = 0;
  let selectedChoice = null;

  const resetResult = () => {
    resultPanel.classList.remove('is-win', 'is-lose');
    resultTitle.textContent = '準備完了';
    resultCopy.textContent = '上・下・左・右から選んで、機械に勝負を挑ましょう。';
    machineDirection.textContent = '…';
    status.textContent = '選択してください';
  };

  const playRound = (playerChoice) => {
    if (selectedChoice) return;

    selectedChoice = playerChoice;
    choiceButtons.forEach((button) => {
      button.disabled = true;
      button.classList.toggle('is-selected', button.dataset.choice === playerChoice);
    });

    const machineChoice = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
    const outcome = determineOutcome(playerChoice, machineChoice);
    const message = getRoundMessage(outcome.result, playerChoice, machineChoice);

    rounds += 1;
    if (outcome.result === 'win') wins += 1;

    machineDirection.textContent = machineChoice;
    resultTitle.textContent = outcome.result === 'win' ? '勝利！' : '負け！';
    resultCopy.textContent = message;
    resultPanel.classList.add(outcome.result === 'win' ? 'is-win' : 'is-lose');
    score.textContent = `${wins} / ${rounds}`;
    status.textContent = outcome.result === 'win' ? 'ドーパミンな勝利' : 'まあ、機械の勝負です';

    if (outcome.result === 'win') createVictoryEffects(effectLayer);
    else createLoseEffects(effectLayer, playerChoice, machineChoice);

    button.textContent = '次の統戦';
    button.disabled = false;
  };

  const resetRound = () => {
    selectedChoice = null;
    effectLayer.replaceChildren();
    document.body.classList.remove('is-celebrating', 'is-lying');
    resetResult();
    choiceButtons.forEach((button) => {
      button.disabled = false;
      button.classList.remove('is-selected');
    });
  };

  choiceButtons.forEach((button) => {
    button.addEventListener('click', () => playRound(button.dataset.choice));
  });

  button.addEventListener('click', () => {
    if (selectedChoice) resetRound();
    else status.textContent = '選択してください';
  });

  resetResult();
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', startGame);
}
