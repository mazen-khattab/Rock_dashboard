export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  governorate: string;
  city: string;
}

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: "cust-1001",
    firstName: "Mazen",
    lastName: "Ahmed",
    email: "mazen.ahmed@example.com",
    phone: "+20 100 123 4567",
    governorate: "Cairo",
    city: "Nasr City",
  },
  {
    id: "cust-1002",
    firstName: "Sara",
    lastName: "Adel",
    email: "sara.adel@example.com",
    phone: "+20 101 555 0101",
    governorate: "Giza",
    city: "Dokki",
  },
  {
    id: "cust-1003",
    firstName: "Omar",
    lastName: "Khaled",
    email: "omar.khaled@example.com",
    phone: "+20 102 987 6543",
    governorate: "Alexandria",
    city: "Smouha",
  },
  {
    id: "cust-1004",
    firstName: "Nour",
    lastName: "Hany",
    email: "nour.hany@example.com",
    phone: "+20 109 333 1212",
    governorate: "Cairo",
    city: "Heliopolis",
  },
  {
    id: "cust-1005",
    firstName: "Youssef",
    lastName: "Samir",
    email: "youssef.samir@example.com",
    phone: "+20 111 678 9910",
    governorate: "Sharqia",
    city: "Zagazig",
  },
  {
    id: "cust-1006",
    firstName: "Laila",
    lastName: "Mostafa",
    email: "laila.mostafa@example.com",
    phone: "+20 112 400 8745",
    governorate: "Dakahlia",
    city: "Mansoura",
  },
  {
    id: "cust-1007",
    firstName: "Karim",
    lastName: "Wael",
    email: "karim.wael@example.com",
    phone: "+20 114 234 1110",
    governorate: "Gharbia",
    city: "Tanta",
  },
  {
    id: "cust-1008",
    firstName: "Farah",
    lastName: "Ibrahim",
    email: "farah.ibrahim@example.com",
    phone: "+20 115 876 3302",
    governorate: "Cairo",
    city: "New Cairo",
  },
  {
    id: "cust-1009",
    firstName: "Hassan",
    lastName: "Ali",
    email: "hassan.ali@example.com",
    phone: "+20 120 987 5500",
    governorate: "Beheira",
    city: "Damanhur",
  },
  {
    id: "cust-1010",
    firstName: "Mariam",
    lastName: "Essam",
    email: "mariam.essam@example.com",
    phone: "+20 122 710 8420",
    governorate: "Cairo",
    city: "Maadi",
  },
  {
    id: "cust-1011",
    firstName: "Ziad",
    lastName: "Tarek",
    email: "ziad.tarek@example.com",
    phone: "+20 125 990 1201",
    governorate: "Minya",
    city: "Minya",
  },
  {
    id: "cust-1012",
    firstName: "Dina",
    lastName: "Ashraf",
    email: "dina.ashraf@example.com",
    phone: "+20 127 600 4430",
    governorate: "Suez",
    city: "Suez",
  },
];
