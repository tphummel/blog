// Loads the game's own engine (cards, deal, rules) out of static/solitaire/index.html so the
// solver and the verifier always use exactly the code the browser runs.
const fs = require('fs'), vm = require('vm'), path = require('path');
const html = fs.readFileSync(path.join(__dirname, '../../static/solitaire/index.html'), 'utf8');
const src = /<script>([\s\S]*)<\/script>/.exec(html)[1];
const code = src.slice(src.indexOf('// ---------- cards'), src.indexOf('// ---------- url state'));
const ctx = { Intl, Date, Math };
vm.createContext(ctx);
vm.runInContext(code + ';this.E={newGame,apply,peek,canDrop,cardName,foundCount,dealDeck,DRAW,suitOf,rankOf,isRed,DAYS_BEFORE,tierOf,DEALS};', ctx);
module.exports = ctx.E;
