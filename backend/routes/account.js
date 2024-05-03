const { Router } = require('express');
const { authMiddleware } = require('../middleware');
const { Account } = require('../database/userSchema');
const mongoose = require('mongoose');

const router = Router();

router.get('/balance', authMiddleware, async (req, res) => {
  const userId = req.userId;
  const account = await Account.findOne({
    userId: userId
  });
  if (!account) {
    return res.json({ message: 'User does not exist' });
  }
  return res.status(200).json({ balance: account.balance });
});

router.post('/transfer', authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { to, amount } = req.body;

    // Input validation
    if (!to || !amount || isNaN(amount) || amount <= 0) {
      throw new Error('Invalid transfer data');
    }

    const userAccount = await Account.findOne({ userId: req.userId }).session(session);

    if (!userAccount || userAccount.balance < amount) {
      throw new Error('Insufficient balance');
    }

    const toAccount = await Account.findOne({ userId: to }).session(session);

    if (!toAccount) {
      throw new Error('Payee does not exist');
    }

    await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
    await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

    // Get the updated balances
    const updatedFromAccount = await Account.findOne({ userId: req.userId }).session(session);
    const updatedToAccount = await Account.findOne({ userId: to }).session(session);

    return res.json({
      message: 'Transfer successful',
      fromAccount: { userId: updatedFromAccount.userId, balance: updatedFromAccount.balance },
      toAccount: { userId: updatedToAccount.userId, balance: updatedToAccount.balance }
    });
  } catch (error) {
    await session.abortTransaction();
    return res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
});

module.exports = router;
