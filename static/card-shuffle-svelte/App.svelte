<script>
  const suits = ['\u2660', '\u2665', '\u2666', '\u2663']; // spades, hearts, diamonds, clubs
  const ranks = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
  let deck = [];

  function initDeck() {
    deck = [];
    for (const suit of suits) {
      for (const rank of ranks) {
        deck.push({ suit, rank, prevIndex: undefined, movement: undefined });
      }
    }
  }

  function shuffle() {
    if (deck.length === 0) {
      initDeck();
    }

    const previousPositions = new Map();
    deck.forEach((card, index) => {
      previousPositions.set(card, index);
    });

    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    deck.forEach((card, index) => {
      const prevIndex = previousPositions.get(card);
      card.prevIndex = prevIndex;
      card.movement = prevIndex !== undefined ? prevIndex - index : undefined;
    });
  }
</script>

<style>
  table {
    border-collapse: collapse;
    margin-top: 1em;
  }
  th, td {
    border: 1px solid #ccc;
    padding: 4px 8px;
    text-align: left;
  }
  .up { color: green; }
  .down { color: red; }
</style>

<button on:click={shuffle}>Shuffle</button>
<table>
  <thead>
    <tr><th>#</th><th>Suit</th><th>Rank</th><th>Prev #</th><th>Δ</th></tr>
  </thead>
  <tbody>
    {#each deck as card, i}
      <tr>
        <td>{i + 1}</td>
        <td>{card.suit}</td>
        <td>{card.rank}</td>
        <td>{card.prevIndex !== undefined ? card.prevIndex + 1 : '-'}</td>
        <td>
          {#if card.prevIndex !== undefined}
            {#if card.movement > 0}
              <span class="up">↑{card.movement}</span>
            {:else if card.movement < 0}
              <span class="down">↓{Math.abs(card.movement)}</span>
            {:else}
              •
            {/if}
          {:else}
            -
          {/if}
        </td>
      </tr>
    {/each}
  </tbody>
</table>
