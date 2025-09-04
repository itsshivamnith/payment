// Payment model/storage

// MVP: In-memory model for storing payment requests
// TODO: Replace with SQLite or MongoDB for production
// Example schema: { paymentId, amount, memo, address, status, createdAt }
const payments = [];

module.exports = {
  // Create a new payment request
  createPayment({ amount, memo, address }) {
    // TODO: Use UUID for paymentId in production
    const paymentId = Date.now().toString();
    const payment = {
      paymentId,
      amount,
      memo,
      address,
      status: "pending",
      createdAt: new Date(),
    };
    payments.push(payment);
    // TODO: Save to database (SQLite/MongoDB)
    return payment;
  },
  // Get a payment by ID
  getPayment(paymentId) {
    // TODO: Query from database
    return payments.find((p) => p.paymentId === paymentId);
  },
  // Update payment status
  updateStatus(paymentId, status) {
    // TODO: Update in database
    const payment = payments.find((p) => p.paymentId === paymentId);
    if (payment) payment.status = status;
    return payment;
  },
  // List all payments
  listPayments() {
    // TODO: Query all from database
    return payments;
  },
};
