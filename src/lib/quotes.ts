const quotes = [
  "Nejlepší trénink je ten, který uděláš.",
  "Každý den je šance být lepší než včera.",
  "Bolest je dočasná, hrdost je navždy.",
  "Společně to dáme! 💪",
  "Disciplína porazí motivaci. Pokaždé.",
  "Malé kroky vedou k velkým výsledkům.",
  "Nemusíš být skvělý, abys začal. Ale musíš začít, abys byl skvělý.",
  "Tvoje tělo zvládne téměř cokoliv. Přesvědč svou hlavu.",
  "Dnes to bolí, zítra to bude síla.",
  "Výmluvy nepálí kalorie.",
  "Každý rep se počítá. Každý den se počítá.",
  "Když je to těžké, znamená to, že rosteš.",
  "Nejhorší trénink je ten, který se neuskutečnil.",
  "Jsi silnější, než si myslíš.",
  "Konzistence je klíč. Prostě se ukaž.",
  "Nikdo nikdy nelitoval, že šel cvičit.",
  "Tvoje budoucí já ti poděkuje.",
  "Jeden tým, jeden cíl. 🏆",
  "Pohyb je lék. Dej si dávku každý den.",
  "Udělej dnes něco, za co ti zítra poděkuješ.",
  "Limit existuje jen v tvé hlavě.",
  "Trénink není punishment. Je to oslava toho, co tvé tělo dokáže.",
  "Nevzdávej se. Výsledky přijdou.",
  "Motivace tě nastartuje, návyk tě udrží.",
  "Pokaždé, když cvičíš, hlasuj pro silnější verzi sebe sama.",
];

export function getRandomQuote(): string {
  return quotes[Math.floor(Math.random() * quotes.length)];
}
