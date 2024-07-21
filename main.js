import "@fontsource/raleway";
import "@fontsource/raleway/500.css";
import "@fontsource/raleway/600.css";
import "@fontsource/raleway/700.css";
import './style.css';

const joeverValueBar = document.getElementById('jover_value');
const kamalaValueBar = document.getElementById('kamala_value');

const joeverValuePercent = document.getElementById('joever_percent').children[0];
const kamalaValuePercent = document.getElementById('kamala_percent').children[0];

const joeverValueText = document.getElementById('joever_text');
const kamalaValueText = document.getElementById('kamala_text');

const dataSourceLinks = document.getElementById('data_source_links');

const calculateBarPos = (percent) => {
  const max = 362;
  const min = 50;

  const diff = max - min;
  const diffMult = diff * (1 - percent);

  return diffMult + min;
};

const calculatePhrase = (percent, object) => {
  const key = object.id.split('_')[0];
  let index = '0';

  if (percent <= 0.10) index = '1';
  else if (percent <= 0.25) index = '2';
  else if (percent <= 0.40) index = '3';
  else if (percent <= 0.60) index = '4';
  else if (percent <= 0.75) index = '5';
  else if (percent <= 0.90) index = '6';
  else if (percent >= 0.90) index = '7';
  else index = '0';

  Object.values(object.children).forEach((child) => {
    if (child.id === `${key}_text_${index}`) child.setAttribute('visibility', 'visible');
    else child.setAttribute('visibility', 'hidden');
  })
}

const updateData = (first = false) => {
  fetch('https://api.joeverlevel.com/')
    .then((res) => res.json())
    .then((data) => {
      joeverValueBar.setAttribute('y', calculateBarPos(data.overall.unweighted.biden));
      kamalaValueBar.setAttribute('y', calculateBarPos(data.overall.unweighted.kamala));

      joeverValuePercent.textContent = `${((1 - data.overall.unweighted.biden) * 100).toFixed(2)}%`;
      kamalaValuePercent.textContent = `${(data.overall.unweighted.kamala * 100).toFixed(2)}%`;

      calculatePhrase(data.overall.unweighted.biden, joeverValueText);
      calculatePhrase(data.overall.unweighted.kamala, kamalaValueText);

      if (first) {
        data.sources.forEach((source) => {
          dataSourceLinks.innerHTML += `&nbsp;<a href="${source.source}" target="_blank">${source.title}</a>`
        })
      }

      console.log('updated')
    })
}

updateData(true);

setInterval(() => updateData(), 10000)