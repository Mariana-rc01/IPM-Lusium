export type RequestsStudents = {
    id: number;
    subject: string;
    studentId: number;
    date: string;
    status: 'Enviado' | 'Aceite' | 'Recusado' | 'Recebido';
    description: string;
    response: string;
};

export type RequestsStudentsDict = {
    [key: number]: RequestsStudents;
};

export type RequestsTeachers = {
    id: number;
    subject: string;
    teacherId: number;
    date: string;
    status: 'Enviado' | 'Aceite' | 'Recusado' | 'Recebido';
    description: string;
    response: string;
};

export type RequestsTeachersDict = {
    [key: number]: RequestsTeachers;
};

export type RequestsDirector = {
    id: number;
    subject: string;
    date: string;
    status: 'Enviado' | 'Aceite' | 'Recusado' | 'Recebido';
    description: string;
};

export type RequestsDirectorDict = {
    [key: number]: RequestsDirector;
};
