import express, { response } from 'express';
import ejs, { Template } from 'ejs';
import fetch from 'node-fetch'

const app = express();
const PORT = 8000;

let fakeData = {
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

app.get('/', function(req, res) {
  ejs.renderFile('sostag.ejs', data,
    {}, function(err, template) {
      if (err) {
        throw err;
      } else {
        res.end(template);
      }
    });
});

/****************************************/
/* ROUTE TO GET USER HEALTH SHEET BY ID */
/****************************************/
// example : http://localhost:8000/123456789
// where 123456789 is the user id

app.get('/:id', async (req, res) => {
  // Create graphql request to API
  const apiReq = JSON.stringify({
    query: `query Query($userId: String) {
        userById(userId: $userId) {
          errors {
            message
            field
          }
          response {
            firstname
            lastname
          }
        }
      }`,
    variables: {
      'userId': req.params.id // user id passed in the url
    }
  })

  const apiRes = await fetch(
    'http://localhost:8080/graphql',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: apiReq
    })

  // handle request error
  if (!apiRes.ok) throw new Error('Error occured : request to sos-tag graphql API failed')

  let data = await apiRes.json()
  data = data.data
  console.log('data : ', data)

  if (data.userById) {
    // Render healt sheet template filled with user data
    const finalData = { ...fakeData, name: data.userById.response.firstname + " " + data.userById.response.lastname }
    console.log('finalData : ', finalData)

    ejs.renderFile('templates/sostag.ejs', finalData, {}, (err, template) => {
      if (err) {
        throw err
      } else {
        res.end(template)
      }
    })
  } else {
    ejs.renderFile('templates/healthSheetNotFound.ejs', { id: req.params.id }, {}, (err, template) => {
      if (err) {
        throw err
      } else {
        res.end(template)
      }
    })
  }
})

// Get dat from API (using graphql)
//   fetch('http://localhost:8080/graphql', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: apiReq
//   })
//     .then(res => res.json())
//     .then(res => res.data)
//     .then(data => {
//       // TEMPORARY
//       console.log('data : ', data)
//       const finalData = { ...fakeData, name: data.userById.response.firstname + " " + data.userById.response.lastname }
//       console.log('finalData : ', finalData)
//
//       // render health sheet with data
//       ejs.renderFile('templates/sostag.ejs', finalData, {}, (err, template) => {
//         if (err) {
//           throw err
//         } else {
//           res.end(template)
//         }
//       })
//     })
//     .catch(err)
// })

app.listen(PORT, function(error) {
  if (error)
    throw error;
  else
    console.log("Server is running");
});
