const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const Subscriber = require("../models/SubscriberModel");


router.get('/subscribers', (req, res) => {
    Subscriber.find().exec((err, subscribers) => {
        if (err) {
            res.json({
                message: err.message
            });
        } else {
            res.render("subscribers", {
                title: "POMS Subscribers",
                subscribers: subscribers
            })
        }
    })

});


router.get('/inventory/6245ada248968bf20c9296f0', (req, res) => {
    try {
      let id = mongoose.Types.ObjectId("6245ada248968bf20c9296f0");
      Subscriber.aggregate()
        .match({ _id: { $eq: id }})
        .project({
          inventory: 1,
        })
        .unwind({"path": inventory})
        .project({ 
            "type" : "$inventory.type", 
            "vendorItemNumber" : "$inventory.vendorItemNumber", 
            "ourItemNumber" : "$inventory.ourItemNumber", 
            "description" : "$inventory.description", 
            "unitOfMeasure" : "$inventory.unitOfMeasure", 
            "cost" : "$inventory.cost", 
            "created" : "$inventory.created", 
            "isActive" : "$inventory.isActive"
        })
        .exec((err, inventory) => {
          if (err) {
            console.log(err);
          } else {
            res.render('inventory', {
                title: "Inventory",
                inventory: inventory
            });
          }
        });
    } catch (err) {
      console.log(err);
      // res.sendStatus(401);
    }
  });

module.exports = router;