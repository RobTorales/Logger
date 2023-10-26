import { ticketModel } from "../dao/models/ticket.model.js";

class TicketServices {
  constructor(ticketModel) {
    this.ticketModel = ticketModel;
  }

  async createTicket(ticketModel, data) {
    try {
      this.validateTicketData(data);

      const ticket = new this.ticketModel(data);
      await ticket.save();

      console.log("Ticket creado:", ticket);
      return ticket;
    } catch (error) {
      console.error("Error al crear el ticket:", error);
      throw error;
    }
  }

  validateTicketData(data) {
    if (
      !data.code ||
      !data.purchase_datetime ||
      !data.amount ||
      !data.purchaser
    ) {
      console.error("Datos incompletos para crear el ticket:", data);
      throw new Error("Datos incompletos para crear el ticket.");
    }
  }
}

export default TicketServices;