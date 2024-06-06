const NodeMailer = require("nodemailer");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const app = express();
const PORT = 3000;

app.use("/stripe", express.raw({ type: "*/*" }));
app.use(express.json());
app.use(cors());

app.post("/pay", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Please enter a name" });
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(res.req.headers.value),
      currency: "USD",
      payment_method_types: ["card"],
      metadata: { name },
    });
    const clientSecret = paymentIntent.client_secret;
    res.json({ message: "Payment initiated", clientSecret });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/nodemail", async (req, res) => {
  console.log("accessed");
  const words = res.req.headers.value.split("_");
  email = words[0];
  name = words[1];
  phoneNumber = words[2];
  address = words[3];
  let products = res.req.body;
  const transporter = NodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: "repsonrepsapp@gmail.com",
      pass: "nzcbuwtyntfnjzms",
    },
  });
  let product_cards = ``;
  products.forEach((product) => {
    console.log(product);
    if (product.hasOwnProperty("participantName")) {
      product_cards += `
    <div
        style="
          display: flex;
          justify-content: center;
          align-items: center;
          background: #fff;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          margin: 20px 0;
          padding: 10px;
          border-radius: 5px;
          width: 80%;
          margin: 20px auto;
        "
      >
        <img
          src="${product.imageURL}"
          alt="Package Image"
          style="width: 150px; height: 150px; margin-right: 20px"
        />
        <div style="flex: 1; text-align: right">
        <h3 style="margin: 0">Package Name: ${product.name}</h3>
           <p style="margin: 0">Package Description: ${product.description}</p>
          <p style="margin: 5px 0">Participant Name: ${product.participantName}</p>
          <p style="margin: 5px 0">Participant Grade: ${product.participantGrade}</p>
          <p style="margin: 5px 0">Price: $${product.price}</p>
          <p style="margin: 5px 0">Jersey Size: ${product.jerseySize}</p>
          <p style="margin: 5px 0">Jersey Short Size: ${product.jerseyShortSize}</p>
          <p style="margin: 5px 0">Shirt Size: ${product.shirtSize}</p>
          <p style="margin: 5px 0">Short Size: ${product.shortSize}</p>
        </div>
      </div>
    `;
    } else if (product.hasOwnProperty("isIndividual")) {
      product_cards += `
       <div
        style="
          display: flex;
          justify-content: center;
          align-items: center;
          background: #fff;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          margin: 20px 0;
          padding: 10px;
          border-radius: 5px;
          width: 80%;
          margin: 20px auto;
        "
      >
        <img
          src="${product.imageURL}"
          alt="Product Image"
          style="width: 150px; height: 150px; margin-right: 20px"
        />
        <div style="flex: 1; text-align: right">
          <h3 style="margin: 0">${product.title}</h3>
          <p style="margin: 0">Coach Name: ${product.name}</p>
           <p style="margin: 0">Date: ${product.date}</p>
          <p style="margin: 5px 0">Time: ${product.time}</p>
          <p style="margin: 5px 0">Location: ${product.location}</p>
          <p style="margin: 5px 0">Price: $${product.price}</p>
        </div>
      </div>
      `;
    } else {
      product_cards += `
      <div
        style="
          display: flex;
          justify-content: center;
          align-items: center;
          background: #fff;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          margin: 20px 0;
          padding: 10px;
          border-radius: 5px;
          width: 80%;
          margin: 20px auto;
        "
      >
        <img
          src="${product.imageURL}"
          alt="Product Image"
          style="width: 150px; height: 150px; margin-right: 20px"
        />
        <div style="flex: 1; text-align: right">
          <h3 style="margin: 0">Product Name: ${product.name}</h3>
           <p style="margin: 0">Quantity: ${product.quantity}</p>
          <p style="margin: 5px 0">Price: $${product.price}</p>
          <p style="margin: 5px 0">Size: ${product.size}</p>
        </div>
      </div>
      `;
    }
  });
  const options = {
    from: "Reps on Reps <repsonrepsapp@gmail.com>",
    to: email,
    subject: "Reps on Reps Order Confirmation for " + name,
    html:
      `<div
      style="
        width: 80%;
        margin: auto;
        overflow: hidden;
        padding: 20px;
        background: #fff;
        font-family: Arial, sans-serif;
      "
    >
      <div style="text-align: center; padding: 10px 0">
        <h1>Thank you for shopping with us, ${name}!</h1>
      </div>
      <div style="text-align: center; margin-bottom: 20px">
        <p>Address: ${address}</p>
        <p>Phone: ${phoneNumber}</p>
      </div>` +
      product_cards +
      `</div>`,
  };
  transporter.sendMail(options, (error, info) => {
    if (error) {
      console.log(error);
    }
    console.log("Sent: " + info.response);
  });
});

app.post("/newsletter", async (req, res) => {
  console.log("accessed");
  let letter = res.req.body;
  const transporter = NodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: "repsonrepsapp@gmail.com",
      pass: "nzcbuwtyntfnjzms",
    },
  });

  console.log(letter);

  const options = {
    from: "Reps on Reps <repsonrepsapp@gmail.com>",
    to: letter.emails,
    subject: letter.title,
    html: `<div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; overflow: hidden; background-color: black;">
        <img src="${letter.image}" alt="Package Image" style="width: 100%; height: 100%; object-fit: cover; aspect-ratio: 2 / 3;">
    </div>`,
  };
  transporter.sendMail(options, (error, info) => {
    if (error) {
      console.log(error);
    }
    console.log("Sent: " + info.response);
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
