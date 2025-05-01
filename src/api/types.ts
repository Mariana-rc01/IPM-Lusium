export type Request = {
    id: string;
    subject: string;
    sender: string;       // user ID of the sender (e.g. student, teacher, director)
    recipient: string;    // user ID of the recipient or 'all' for broadcasts
    date: string;         // in format "DD-MM-YYYY"
    status: '' | 'Enviado' | 'Aceite' | 'Recusado' | 'Recebido';
    description: string;
    response: string;
  };

  export type Requests = Request[];