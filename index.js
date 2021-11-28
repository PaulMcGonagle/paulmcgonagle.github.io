const {
  conversation,
  Simple,
  Canvas,
  Card,
  Link,
  Suggestion,
  Image,
} = require('@assistant/conversation');
const functions = require('firebase-functions');
const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);

const app = conversation();

const categories = {
  history: {
    facts: [
      'Google has more than 70 offices in more than 40 countries.',
      'Google went public in 2004.',
      'Google was founded by Larry Page and Sergey Brin.',
      'Google was founded in 1998.',
    ],
    image: {
      url: "https://storage.googleapis.com/gweb-uniblog-publish-prod/images/" +
        "Search_GSA.2e16d0ba.fill-300x300.png",
      alt: 'Google app logo',
    },
  },
  headquarters: {
    facts: [
      'Google has over 30 cafeterias in its main campus.',
      'Google\'s headquarters is in Mountain View, California.',
      'Google has over 10 fitness facilities in its main campus.',
    ],
    image: {
      url: "https://storage.googleapis.com/gweb-uniblog-publish-prod/images/" +
        "Wide-view-of-Google-campus.max-900x900.jpg",
      alt: 'Googleplex',
    },
  },
  cats: {
    facts: [
      'Cats are animals.',
      'Cats descend from other cats.',
      'Cats have nine lives.',
    ],
    image: {
      url: "https://developers.google.com/web/fundamentals/accessibility/semantics-builtin/imgs/" +
        "160204193356-01-cat-500.jpg",
      alt: 'Gray cat',
    },
  },
};

app.handle('get_fact', (conv) => {
  const category = conv.scene.slots.fact_category.value;
  const prefix = `Sure, here\'s a ${category} fact.`;
  const facts = categories[category].facts;
  const fact = facts[Math.floor(Math.random() * facts.length)];
  const image = categories[category].image;
  const supportsRichResponse = conv.device.capabilities.includes("RICH_RESPONSE");
  if (supportsRichResponse) {
    conv.add(new Card({
      title: fact,
      image: new Image(image),
      button: new Link({
        name: 'Learn more',
        open: {
          url: 'https://www.google.com/about/',
        },
      }),
    }));
  }
  conv.add(new Simple({
    speech: `${prefix} ${fact}`,
    text: prefix,
  }));
  conv.add(new Suggestion({title: 'Yes'}));
  conv.add(new Suggestion({title: 'No'}));
  conv.add(new Suggestion({title: 'Headquarters'}));
  conv.add(new Suggestion({title: 'History'}));
  conv.add(new Suggestion({title: 'Quit'}));
});

exports.ActionsOnGoogleFulfillment = functions.https.onRequest(app);
