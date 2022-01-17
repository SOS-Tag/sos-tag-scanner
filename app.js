import express from 'express';
import ejs from 'ejs';

const app = express();
const PORT = 8000;

const data = {
  name: "M. Gérard Durand",
  dob: "25/04/1973 · 48 ans",
  height: "178 cm",
  weight: "86 kg",
  blocks: [
    {
      name: "Antécédents médicaux",
      content: "Hypertension artérielle",
    },
    {
      name: "Allergies et réactions",
      content: "Venin d'abeilles",
    },
    {
      name: "Traitements en cours",
      content: "Corticoïdes",
    },
    {
      name: "Groupe sanguin",
      content: "O+",
    },
  ],
  contacts: [
    {
      role: "Compagne",
      name: "Marie Durand",
      content: "06 24 78 85 10",
    },
    {
      role: "Frère",
      name: "Fabrice Durand",
      content: "06 85 96 22 05",
    },
  ]
};

app.get('/', function (req, res) {
  ejs.renderFile('sostag.ejs', data,
    {}, function (err, template) {
      if (err) {
        throw err;
      } else {
        res.end(template);
      }
    });
});

app.listen(PORT, function (error) {
  if (error)
    throw error;
  else
    console.log("Server is running");
});
