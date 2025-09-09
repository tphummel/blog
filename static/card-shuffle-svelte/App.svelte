<script>
  const suits = ['\u2660', '\u2665', '\u2666', '\u2663']; // spades, hearts, diamonds, clubs
  const ranks = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
  let deck = [];

  function shuffle() {
    deck = [];
    for (const suit of suits) {
      for (const rank of ranks) {
        deck.push({ suit, rank });
      }
    }
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
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
</style>

<button on:click={shuffle}>Shuffle</button>
<table>
  <thead>
    <tr><th>#</th><th>Suit</th><th>Rank</th></tr>
  </thead>
  <tbody>
    {#each deck as card, i}
      <tr><td>{i + 1}</td><td>{card.suit}</td><td>{card.rank}</td></tr>
    {/each}
  </tbody>
</table>
