import test from 'node:test';
import assert from 'node:assert/strict';

import { DIRECTIONS, LOSE_MESSAGES, determineOutcome, getRoundMessage } from './game.js';

test('the game offers all four directions', () => {
  assert.deepEqual(DIRECTIONS, ['上', '下', '左', '右']);
});

test('player wins when their choice matches the random direction', () => {
  assert.deepEqual(determineOutcome('左', '左'), {
    playerChoice: '左',
    result: 'win',
  });
});

test('player loses when their choice differs from the random direction', () => {
  assert.deepEqual(determineOutcome('右', '上'), {
    playerChoice: '右',
    result: 'lose',
  });
});

test('win message celebrates the player', () => {
  assert.match(getRoundMessage('win', '上', '上'), /勝利/);
});

test('lose message provides five different teasing patterns', () => {
  assert.equal(LOSE_MESSAGES.length, 5);
  assert.equal(new Set(LOSE_MESSAGES).size, 5);
  assert.match(getRoundMessage('lose', '下', '上'), /負け！/);
});
