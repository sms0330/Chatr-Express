const {
  Message
} = require("../models");

module.exports = {
  async index(req, res, next) {
    try {
      const {
        flagged,
        username
      } = req.query;
      let messages = null;
      let whereObj = {};
      if (flagged) {
        whereObj.flagged = true;
      }
      if (username) {
        whereObj.username = username;
      }
      messages = await Message.findAll({
        order: [
          ["createdAt", "DESC"]
        ],
        where: whereObj
      });
      res.json(messages);
    } catch (error) {
      res.json({
        error
      });
    }
  },

  async create(req, res, next) {
    const {
      username,
      flagged,
      body
    } = req.body;

    try {
      await Message.create({
        username,
        flagged,
        body
      });
      res.status(201).end();
    } catch (error) {
      res.json({
        error
      });
    }
  },

  async update(req, res, next) {
    const {
      id
    } = req.params;
    const {
      username,
      body
    } = req.body;
    try {
      const message = await Message.findById(id);
      await message.update({
        username,
        body
      });
      res.status(200).end();
    } catch (error) {
      res.json({
        error
      });
    }
  },

  async destroy(req, res, next) {
    const {
      id
    } = req.params;

    try {
      const message = await Message.findById(id);
      await message.destroy();
      res.status(200).end();
    } catch (error) {
      res.json({
        error
      });
    }
  },

  async changeFlag(req, res, next) {
    const {
      id
    } = req.params;
    let {
      flagged
    } = req.body;
    flagged = !flagged;
    try {
      const message = await Message.findById(id);
      await message.update({
        flagged
      });
      res.status(200).end();
    } catch (error) {
      res.json({
        error
      });
    }
  }
};

