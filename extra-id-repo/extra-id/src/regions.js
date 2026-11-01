// Extra ID — региональные наборы имён для генерации персон.
// Запись вида "漢字|romaji" хранит оригинал и латинскую форму (для логина и почты).
// pat — отчества (только ru/uk): "муж|жен" или одна мужская форма (женская образуется сама).
// Списки упорядочены от более частых имён к менее частым: генератор выбирает с перекосом
// к началу списка (см. pickCommon в lib.js), чтобы сочетания выглядели как у реальных людей.

export const REGIONS = {
  ru: {
    dateFmt: 'DD.MM.YYYY',
    male: ['Александр', 'Дмитрий', 'Сергей', 'Андрей', 'Алексей', 'Максим', 'Михаил', 'Иван', 'Артём', 'Никита', 'Владимир', 'Евгений', 'Николай', 'Павел', 'Роман', 'Денис', 'Егор', 'Илья', 'Кирилл', 'Антон', 'Олег', 'Виктор', 'Станислав', 'Игорь', 'Юрий', 'Константин', 'Тимур', 'Георгий', 'Вадим', 'Глеб', 'Святослав', 'Григорий', 'Леонид', 'Борис', 'Фёдор', 'Матвей', 'Арсений', 'Данил', 'Ярослав', 'Руслан'],
    female: ['Анна', 'Елена', 'Мария', 'Ольга', 'Наталья', 'Екатерина', 'Татьяна', 'Ирина', 'Светлана', 'Юлия', 'Анастасия', 'Дарья', 'Марина', 'Алина', 'Виктория', 'Полина', 'Ксения', 'Вера', 'Людмила', 'Евгения', 'Надежда', 'Алёна', 'Валерия', 'Софья', 'Елизавета', 'Кристина', 'Диана', 'Галина', 'Яна', 'Алиса', 'Милана', 'Маргарита', 'Василиса', 'Любовь', 'Лариса', 'Оксана', 'Инна', 'Тамара', 'Вероника', 'Лидия'],
    sur: ['Иванов', 'Смирнов', 'Кузнецов', 'Попов', 'Васильев', 'Петров', 'Соколов', 'Михайлов', 'Новиков', 'Фёдоров', 'Морозов', 'Волков', 'Алексеев', 'Лебедев', 'Семёнов', 'Егоров', 'Павлов', 'Козлов', 'Степанов', 'Николаев', 'Орлов', 'Андреев', 'Макаров', 'Никитин', 'Захаров', 'Зайцев', 'Соловьёв', 'Борисов', 'Яковлев', 'Григорьев', 'Романов', 'Воробьёв', 'Сергеев', 'Кузьмин', 'Фролов', 'Александров', 'Дмитриев', 'Королёв', 'Гусев', 'Киселёв', 'Ильин', 'Максимов', 'Поляков', 'Сорокин', 'Виноградов', 'Ковалёв', 'Белов', 'Медведев', 'Антонов', 'Тарасов', 'Жуков', 'Баранов', 'Филиппов', 'Комаров', 'Давыдов', 'Беляев', 'Герасимов', 'Богданов', 'Осипов', 'Сидоров', 'Горский', 'Ковальский'],
    pat: ['Александрович', 'Дмитриевич', 'Сергеевич', 'Андреевич', 'Иванович', 'Михайлович', 'Николаевич', 'Владимирович', 'Алексеевич', 'Павлович', 'Викторович', 'Олегович', 'Игоревич', 'Юрьевич', 'Евгеньевич', 'Анатольевич', 'Геннадьевич', 'Борисович', 'Петрович', 'Васильевич', 'Максимович', 'Артёмович', 'Романович', 'Денисович', 'Константинович'],
  },
  uk: {
    dateFmt: 'DD.MM.YYYY',
    male: ['Олександр', 'Андрій', 'Дмитро', 'Сергій', 'Максим', 'Іван', 'Михайло', 'Богдан', 'Володимир', 'Олексій', 'Артем', 'Роман', 'Назар', 'Денис', 'Віктор', 'Тарас', 'Олег', 'Микола', 'Павло', 'Ілля', 'Юрій', 'Ярослав', 'Василь', 'Петро', 'Данило', 'Станіслав', 'Євген', 'Вадим', 'Кирило', 'Антон', 'Руслан', 'Остап', 'Любомир', 'Орест', 'Степан', 'Григорій', 'Леонід', 'Тимофій', 'Захар'],
    female: ['Анна', 'Олена', 'Марія', 'Ольга', 'Наталія', 'Катерина', 'Тетяна', 'Ірина', 'Світлана', 'Юлія', 'Анастасія', 'Дарина', 'Марина', 'Оксана', 'Вікторія', 'Софія', 'Ксенія', 'Віра', 'Людмила', 'Галина', 'Надія', 'Валентина', 'Яна', 'Аліна', 'Христина', 'Діана', 'Євгенія', 'Лариса', 'Тамара', 'Злата', 'Мирослава', 'Соломія', 'Поліна', 'Василина', 'Леся', 'Уляна', 'Богдана', 'Іванна', 'Олександра'],
    sur: ['Шевченко', 'Коваленко', 'Бондаренко', 'Бойко', 'Ткаченко', 'Кравченко', 'Ковальчук', 'Коваль', 'Олійник', 'Шевчук', 'Поліщук', 'Бондар', 'Ткачук', 'Мороз', 'Марченко', 'Лисенко', 'Руденко', 'Савченко', 'Петренко', 'Мельник', 'Клименко', 'Кравчук', 'Гончаренко', 'Литвин', 'Мазур', 'Мартинюк', 'Павленко', 'Савчук', 'Яковенко', 'Кириленко', 'Волошин', 'Романенко', 'Панченко', 'Захарченко', 'Тимошенко', 'Гнатюк', 'Білоус', 'Кушнір', 'Гордієнко', 'Шаповал', 'Ковальський'],
    pat: ['Олександрович|Олександрівна', 'Дмитрович|Дмитрівна', 'Сергійович|Сергіївна', 'Андрійович|Андріївна', 'Михайлович|Михайлівна', 'Іванович|Іванівна', 'Миколайович|Миколаївна', 'Максимович|Максимівна', 'Павлович|Павлівна', 'Володимирович|Володимирівна', 'Олексійович|Олексіївна', 'Вікторович|Вікторівна', 'Олегович|Олегівна', 'Петрович|Петрівна', 'Васильович|Василівна', 'Богданович|Богданівна', 'Романович|Романівна', 'Тарасович|Тарасівна', 'Юрійович|Юріївна', 'Степанович|Степанівна'],
  },
  en: {
    dateFmt: 'DD/MM/YYYY',
    male: ['James', 'Michael', 'Robert', 'John', 'David', 'William', 'Daniel', 'Matthew', 'Andrew', 'Christopher', 'Joseph', 'Thomas', 'Ryan', 'Joshua', 'Nicholas', 'Kevin', 'Brian', 'Jason', 'Eric', 'Adam', 'Benjamin', 'Samuel', 'Alexander', 'Jonathan', 'Luke', 'Oliver', 'Jack', 'Harry', 'George', 'Charlie', 'Henry', 'Edward', 'Tyler', 'Nathan', 'Aaron', 'Patrick'],
    female: ['Emily', 'Sarah', 'Jessica', 'Emma', 'Olivia', 'Hannah', 'Laura', 'Rachel', 'Megan', 'Lauren', 'Natalie', 'Charlotte', 'Amelia', 'Sophie', 'Grace', 'Chloe', 'Lucy', 'Katie', 'Rebecca', 'Anna', 'Victoria', 'Elizabeth', 'Samantha', 'Amy', 'Jennifer', 'Michelle', 'Nicole', 'Alice', 'Holly', 'Eleanor', 'Isabella', 'Claire', 'Zoe', 'Hayley', 'Kate', 'Abigail'],
    sur: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Taylor', 'Davies', 'Wilson', 'Evans', 'Thomas', 'Roberts', 'Walker', 'Wright', 'Robinson', 'Thompson', 'White', 'Hughes', 'Edwards', 'Green', 'Hall', 'Wood', 'Harris', 'Lewis', 'Martin', 'Jackson', 'Clarke', 'Turner', 'Hill', 'Scott', 'Cooper', 'Morris', 'Ward', 'Moore', 'King', 'Watson', 'Baker', 'Harrison', 'Morgan', 'Young', 'Allen', 'Mitchell', 'Anderson', 'Miller', 'Davis', 'Parker', 'Collins', 'Bennett', 'Carter'],
  },
  es: {
    dateFmt: 'DD/MM/YYYY',
    male: ['Antonio', 'José', 'Manuel', 'Francisco', 'David', 'Juan', 'Javier', 'Daniel', 'Carlos', 'Miguel', 'Alejandro', 'Rafael', 'Pablo', 'Sergio', 'Pedro', 'Ángel', 'Fernando', 'Jorge', 'Luis', 'Álvaro', 'Adrián', 'Diego', 'Andrés', 'Iván', 'Rubén', 'Raúl', 'Alberto', 'Víctor', 'Marcos', 'Hugo', 'Mario', 'Óscar', 'Enrique', 'Ignacio', 'Roberto', 'Jesús'],
    female: ['María', 'Carmen', 'Ana', 'Laura', 'Isabel', 'Marta', 'Lucía', 'Paula', 'Elena', 'Cristina', 'Sara', 'Raquel', 'Pilar', 'Rosa', 'Patricia', 'Andrea', 'Beatriz', 'Silvia', 'Nuria', 'Irene', 'Sofía', 'Alba', 'Claudia', 'Teresa', 'Julia', 'Mónica', 'Inés', 'Natalia', 'Rocío', 'Marina', 'Eva', 'Clara', 'Sandra', 'Lorena', 'Noelia', 'Verónica'],
    sur: ['García', 'Rodríguez', 'González', 'Fernández', 'López', 'Martínez', 'Sánchez', 'Pérez', 'Gómez', 'Martín', 'Jiménez', 'Ruiz', 'Hernández', 'Díaz', 'Moreno', 'Muñoz', 'Álvarez', 'Romero', 'Alonso', 'Gutiérrez', 'Navarro', 'Torres', 'Domínguez', 'Vázquez', 'Ramos', 'Gil', 'Ramírez', 'Serrano', 'Blanco', 'Molina', 'Morales', 'Suárez', 'Ortega', 'Delgado', 'Castro', 'Ortiz', 'Rubio', 'Marín', 'Sanz', 'Iglesias', 'Medina', 'Garrido', 'Cortés', 'Castillo', 'Santos', 'Lozano', 'Guerrero', 'Cano', 'Prieto', 'Méndez'],
  },
  pt: {
    dateFmt: 'DD/MM/YYYY',
    male: ['João', 'Pedro', 'Lucas', 'Gabriel', 'Mateus', 'Guilherme', 'Rafael', 'Felipe', 'Bruno', 'Gustavo', 'Rodrigo', 'Thiago', 'Carlos', 'Leonardo', 'Daniel', 'Eduardo', 'Henrique', 'Diego', 'Marcelo', 'André', 'Vinícius', 'Fernando', 'Ricardo', 'Fábio', 'Leandro', 'Caio', 'Renato', 'Murilo', 'Sérgio', 'Paulo', 'Márcio', 'Samuel'],
    female: ['Maria', 'Ana', 'Juliana', 'Fernanda', 'Camila', 'Beatriz', 'Larissa', 'Patrícia', 'Aline', 'Mariana', 'Letícia', 'Gabriela', 'Amanda', 'Bruna', 'Jéssica', 'Carolina', 'Luana', 'Isabela', 'Rafaela', 'Natália', 'Vanessa', 'Débora', 'Priscila', 'Raquel', 'Renata', 'Tatiana', 'Daniela', 'Sabrina', 'Luciana', 'Cláudia', 'Viviane', 'Thaís'],
    sur: ['Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira', 'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho', 'Almeida', 'Lopes', 'Soares', 'Fernandes', 'Vieira', 'Barbosa', 'Rocha', 'Dias', 'Nascimento', 'Andrade', 'Moreira', 'Nunes', 'Marques', 'Machado', 'Mendes', 'Freitas', 'Cardoso', 'Ramos', 'Gonçalves', 'Santana', 'Teixeira', 'Araújo', 'Cavalcanti', 'Moura', 'Correia', 'Monteiro'],
  },
  de: {
    dateFmt: 'DD.MM.YYYY',
    male: ['Lukas', 'Leon', 'Jonas', 'Felix', 'Maximilian', 'Paul', 'Tim', 'Jan', 'Niklas', 'Finn', 'Elias', 'Noah', 'Luca', 'Moritz', 'Tobias', 'Florian', 'Stefan', 'Thomas', 'Michael', 'Andreas', 'Christian', 'Daniel', 'Sebastian', 'Alexander', 'Matthias', 'Markus', 'Philipp', 'Benjamin', 'Fabian', 'Simon', 'David', 'Johannes', 'Julian', 'Dominik', 'Kevin'],
    female: ['Anna', 'Laura', 'Julia', 'Lena', 'Sophie', 'Katharina', 'Sabine', 'Nina', 'Lisa', 'Marie', 'Hannah', 'Franziska', 'Lea', 'Mia', 'Johanna', 'Emma', 'Clara', 'Sarah', 'Jana', 'Charlotte', 'Annika', 'Melanie', 'Christina', 'Stefanie', 'Nicole', 'Vanessa', 'Carina', 'Theresa', 'Svenja', 'Miriam', 'Elisa', 'Jessica', 'Pia', 'Carolin', 'Andrea', 'Petra'],
    sur: ['Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker', 'Schulz', 'Hoffmann', 'Schäfer', 'Koch', 'Bauer', 'Richter', 'Klein', 'Wolf', 'Schröder', 'Neumann', 'Schwarz', 'Zimmermann', 'Braun', 'Krüger', 'Hofmann', 'Hartmann', 'Lange', 'Schmitt', 'Werner', 'Schmitz', 'Krause', 'Meier', 'Lehmann', 'Schmid', 'Schulze', 'Maier', 'Köhler', 'Herrmann', 'König', 'Walter', 'Mayer', 'Huber', 'Kaiser', 'Fuchs', 'Peters', 'Lang', 'Scholz', 'Möller', 'Weiß', 'Jung', 'Hahn', 'Vogel'],
  },
  fr: {
    dateFmt: 'DD/MM/YYYY',
    male: ['Lucas', 'Louis', 'Hugo', 'Gabriel', 'Arthur', 'Thomas', 'Nicolas', 'Julien', 'Antoine', 'Maxime', 'Pierre', 'Mathieu', 'Alexandre', 'Romain', 'Paul', 'Théo', 'Clément', 'Quentin', 'Kévin', 'Florian', 'Baptiste', 'Guillaume', 'Vincent', 'Adrien', 'Benoît', 'Sébastien', 'Jérôme', 'Olivier', 'Damien', 'Étienne', 'Raphaël', 'Mathis', 'Axel', 'Valentin', 'Rémi'],
    female: ['Emma', 'Léa', 'Chloé', 'Manon', 'Sarah', 'Julie', 'Marie', 'Claire', 'Laura', 'Camille', 'Élodie', 'Inès', 'Louise', 'Jade', 'Alice', 'Lola', 'Zoé', 'Anaïs', 'Marion', 'Pauline', 'Océane', 'Mathilde', 'Charlotte', 'Margaux', 'Clara', 'Juliette', 'Amélie', 'Céline', 'Aurélie', 'Sophie', 'Justine', 'Lucie', 'Noémie', 'Élise'],
    sur: ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau', 'Simon', 'Laurent', 'Lefebvre', 'Michel', 'Garcia', 'David', 'Bertrand', 'Roux', 'Vincent', 'Fournier', 'Morel', 'Girard', 'André', 'Lefèvre', 'Mercier', 'Dupont', 'Lambert', 'Bonnet', 'François', 'Martinez', 'Legrand', 'Garnier', 'Faure', 'Rousseau', 'Blanc', 'Guérin', 'Muller', 'Henry', 'Roussel', 'Nicolas', 'Perrin', 'Morin', 'Mathieu', 'Clément', 'Gauthier', 'Dumont', 'Lopez', 'Fontaine', 'Chevalier', 'Robin'],
  },
  it: {
    dateFmt: 'DD/MM/YYYY',
    male: ['Francesco', 'Alessandro', 'Andrea', 'Lorenzo', 'Matteo', 'Leonardo', 'Gabriele', 'Riccardo', 'Marco', 'Luca', 'Giuseppe', 'Davide', 'Simone', 'Federico', 'Stefano', 'Paolo', 'Antonio', 'Giovanni', 'Mattia', 'Nicola', 'Filippo', 'Emanuele', 'Daniele', 'Roberto', 'Fabio', 'Claudio', 'Massimo', 'Alberto', 'Michele', 'Diego', 'Edoardo', 'Tommaso', 'Enrico', 'Giacomo', 'Vincenzo', 'Salvatore'],
    female: ['Giulia', 'Sofia', 'Chiara', 'Francesca', 'Martina', 'Sara', 'Elena', 'Alice', 'Giorgia', 'Valentina', 'Silvia', 'Federica', 'Alessia', 'Aurora', 'Beatrice', 'Ginevra', 'Elisa', 'Anna', 'Laura', 'Paola', 'Roberta', 'Serena', 'Claudia', 'Eleonora', 'Ilaria', 'Marta', 'Veronica', 'Arianna', 'Lucia', 'Cristina', 'Monica', 'Simona', 'Michela', 'Irene', 'Maria', 'Camilla'],
    sur: ['Rossi', 'Russo', 'Ferrari', 'Esposito', 'Bianchi', 'Romano', 'Colombo', 'Ricci', 'Marino', 'Greco', 'Bruno', 'Gallo', 'Conti', 'De Luca', 'Mancini', 'Costa', 'Giordano', 'Rizzo', 'Lombardi', 'Moretti', 'Barbieri', 'Fontana', 'Santoro', 'Mariani', 'Rinaldi', 'Caruso', 'Ferrara', 'Galli', 'Martini', 'Leone', 'Longo', 'Gentile', 'Martinelli', 'Vitale', 'Serra', 'Coppola', 'De Santis', 'Marchetti', 'Parisi', 'Villa', 'Conte', 'Ferraro', 'Fabbri', 'Bianco', 'Marini', 'Grasso', 'Valentini', 'Messina', 'Sala', 'Gatti'],
  },
  pl: {
    dateFmt: 'DD.MM.YYYY',
    male: ['Jan', 'Piotr', 'Krzysztof', 'Andrzej', 'Tomasz', 'Paweł', 'Michał', 'Marcin', 'Łukasz', 'Jakub', 'Mateusz', 'Marek', 'Grzegorz', 'Adam', 'Wojciech', 'Dawid', 'Rafał', 'Kamil', 'Szymon', 'Maciej', 'Damian', 'Bartosz', 'Sebastian', 'Mariusz', 'Robert', 'Dariusz', 'Karol', 'Filip', 'Artur', 'Kacper', 'Patryk', 'Adrian', 'Jacek', 'Radosław', 'Daniel', 'Konrad'],
    female: ['Anna', 'Maria', 'Katarzyna', 'Małgorzata', 'Agnieszka', 'Barbara', 'Ewa', 'Magdalena', 'Joanna', 'Zofia', 'Aleksandra', 'Monika', 'Krystyna', 'Dorota', 'Beata', 'Karolina', 'Marta', 'Justyna', 'Paulina', 'Natalia', 'Weronika', 'Julia', 'Oliwia', 'Patrycja', 'Martyna', 'Kamila', 'Iwona', 'Edyta', 'Renata', 'Sylwia', 'Izabela', 'Alicja', 'Wiktoria', 'Klaudia', 'Emilia', 'Dominika'],
    sur: ['Nowak', 'Kowalski', 'Wiśniewski', 'Wójcik', 'Kowalczyk', 'Kamiński', 'Lewandowski', 'Zieliński', 'Szymański', 'Woźniak', 'Dąbrowski', 'Kozłowski', 'Jankowski', 'Mazur', 'Wojciechowski', 'Kwiatkowski', 'Krawczyk', 'Kaczmarek', 'Piotrowski', 'Grabowski', 'Zając', 'Pawłowski', 'Michalski', 'Król', 'Wieczorek', 'Jabłoński', 'Wróbel', 'Nowakowski', 'Majewski', 'Olszewski', 'Stępień', 'Malinowski', 'Jaworski', 'Adamczyk', 'Dudek', 'Nowicki', 'Pawlak', 'Górski', 'Witkowski', 'Walczak', 'Sikora', 'Baran', 'Rutkowski', 'Michalak', 'Szewczyk', 'Ostrowski', 'Tomaszewski', 'Pietrzak', 'Zalewski', 'Wróblewski'],
  },
  id: {
    dateFmt: 'DD/MM/YYYY',
    male: ['Budi', 'Agus', 'Andi', 'Dedi', 'Eko', 'Rizky', 'Fajar', 'Bayu', 'Hendra', 'Dimas', 'Rudi', 'Yoga', 'Ahmad', 'Muhammad', 'Joko', 'Slamet', 'Wahyu', 'Adi', 'Arif', 'Dwi', 'Reza', 'Rian', 'Doni', 'Hadi', 'Irfan', 'Yusuf', 'Ilham', 'Bagus', 'Gilang', 'Teguh', 'Rahmat', 'Fauzan', 'Aditya', 'Taufik', 'Heru', 'Indra'],
    female: ['Siti', 'Dewi', 'Rina', 'Putri', 'Ayu', 'Sari', 'Wulan', 'Intan', 'Nur', 'Maya', 'Lina', 'Fitri', 'Ratna', 'Wati', 'Rini', 'Sri', 'Yuni', 'Dian', 'Rahma', 'Nia', 'Aulia', 'Anisa', 'Citra', 'Dina', 'Eka', 'Fatimah', 'Indah', 'Kartika', 'Mega', 'Novi', 'Rosa', 'Tika', 'Vina', 'Yanti', 'Zahra'],
    sur: ['Santoso', 'Wijaya', 'Saputra', 'Pratama', 'Hidayat', 'Kusuma', 'Setiawan', 'Nugroho', 'Susanto', 'Wibowo', 'Hartono', 'Permana', 'Lestari', 'Utama', 'Gunawan', 'Kurniawan', 'Suryanto', 'Hakim', 'Firmansyah', 'Ramadhan', 'Purnomo', 'Prasetyo', 'Siregar', 'Nasution', 'Simanjuntak', 'Sitompul', 'Lubis', 'Harahap', 'Rahman', 'Maulana', 'Syahputra', 'Wahyudi', 'Putra', 'Sutanto', 'Budiman', 'Hermawan', 'Halim', 'Irawan', 'Lesmana'],
  },
  hi: {
    dateFmt: 'DD/MM/YYYY',
    male: ['Aarav', 'Vivaan', 'Arjun', 'Rohan', 'Rahul', 'Amit', 'Vikram', 'Sanjay', 'Rajesh', 'Karan', 'Aditya', 'Nikhil', 'Ankit', 'Manish', 'Suresh', 'Deepak', 'Rohit', 'Vishal', 'Ajay', 'Sachin', 'Pranav', 'Harsh', 'Ishaan', 'Kunal', 'Mohit', 'Naveen', 'Pankaj', 'Varun', 'Yash', 'Gaurav', 'Abhishek', 'Ashok', 'Dinesh', 'Siddharth', 'Tarun', 'Anil'],
    female: ['Priya', 'Ananya', 'Neha', 'Pooja', 'Kavya', 'Isha', 'Anjali', 'Sneha', 'Riya', 'Meera', 'Divya', 'Shreya', 'Aditi', 'Nisha', 'Swati', 'Kritika', 'Radha', 'Sunita', 'Anita', 'Sapna', 'Komal', 'Preeti', 'Simran', 'Tanvi', 'Shweta', 'Deepika', 'Madhuri', 'Ritu', 'Payal', 'Jyoti', 'Manisha', 'Rekha', 'Sakshi', 'Nidhi', 'Pallavi', 'Aarti'],
    sur: ['Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Patel', 'Mehta', 'Joshi', 'Reddy', 'Nair', 'Iyer', 'Chopra', 'Malhotra', 'Bansal', 'Agarwal', 'Yadav', 'Mishra', 'Pandey', 'Chauhan', 'Kapoor', 'Khanna', 'Bhatia', 'Saxena', 'Tiwari', 'Srivastava', 'Jain', 'Rao', 'Das', 'Menon', 'Desai', 'Shah', 'Thakur', 'Kulkarni', 'Banerjee', 'Mukherjee', 'Chatterjee', 'Sinha', 'Arora', 'Sethi', 'Trivedi'],
  },
  ja: {
    dateFmt: 'YYYY/MM/DD',
    nameOrder: 'last-first',
    male: ['太郎|Taro', '健太|Kenta', '翔太|Shota', '大輔|Daisuke', '拓也|Takuya', '直樹|Naoki', '陽介|Yosuke', '亮|Ryo', '誠|Makoto', '悠斗|Yuto', '蓮|Ren', '大和|Yamato', '颯太|Sota', '健|Ken', '学|Manabu', '剛|Tsuyoshi', '隼人|Hayato', '慎太郎|Shintaro', '和也|Kazuya', '達也|Tatsuya', '勇気|Yuki', '光|Hikaru', '駿|Shun', '裕太|Yuta', '浩二|Koji', '雄大|Yudai', '圭太|Keita', '康介|Kosuke', '悠真|Yuma', '海斗|Kaito'],
    female: ['美咲|Misaki', '陽子|Yoko', '結衣|Yui', '愛|Ai', '優子|Yuko', '真由|Mayu', '彩|Aya', '恵|Megumi', '花|Hana', '沙織|Saori', '葵|Aoi', '美月|Mitsuki', '莉子|Riko', '結菜|Yuna', '由美|Yumi', '智子|Tomoko', '久美子|Kumiko', '麻衣|Mai', '奈々|Nana', '千尋|Chihiro', '彩花|Ayaka', '明日香|Asuka', '七海|Nanami', '裕子|Hiroko', '梨花|Rika', '栞|Shiori', '純子|Junko', '瞳|Hitomi', '咲希|Saki'],
    sur: ['佐藤|Sato', '鈴木|Suzuki', '高橋|Takahashi', '田中|Tanaka', '伊藤|Ito', '渡辺|Watanabe', '山本|Yamamoto', '中村|Nakamura', '小林|Kobayashi', '加藤|Kato', '吉田|Yoshida', '山田|Yamada', '佐々木|Sasaki', '山口|Yamaguchi', '松本|Matsumoto', '井上|Inoue', '木村|Kimura', '林|Hayashi', '斎藤|Saito', '清水|Shimizu', '山崎|Yamazaki', '森|Mori', '池田|Ikeda', '橋本|Hashimoto', '阿部|Abe', '石川|Ishikawa', '山下|Yamashita', '中島|Nakajima', '前田|Maeda', '藤田|Fujita', '小川|Ogawa', '後藤|Goto', '岡田|Okada', '長谷川|Hasegawa', '村上|Murakami', '近藤|Kondo', '石井|Ishii', '坂本|Sakamoto', '遠藤|Endo', '青木|Aoki', '藤井|Fujii'],
  },
};

export const REGION_CODES = Object.keys(REGIONS);
