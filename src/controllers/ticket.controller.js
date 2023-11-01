import TicketServices from "../services/ticket.services.js";

class TicketController {
  constructor() {
    this.ticketServices = new TicketServices();
  }

  async createTicket(req) {
    try {
        console.log("Datos recibidos en req.body:", req.body);

        const data = req.body;
        const ticket = await this.ticketService.createTicket(data);

        if (ticket) {
            console.log("Ticket creado", ticket); 
            return ticket;  
        } else {
            throw new Error("Error al crear el ticket");
        }
    } catch (error) {
        req.logger.error('Error específico en la creación del ticket:', error);
        throw error;  
    }
}

}

export default new TicketController();