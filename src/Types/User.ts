export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "Super Admin" | "Admin" | "Support";
}

export const MOCK_ADMIN_USERS: AdminUser[] = [
  {
    id: "admin-1001",
    firstName: "Mazen",
    lastName: "Ahmed",
    email: "mazen.ahmed@rock.com",
    role: "Super Admin",
  },
  {
    id: "admin-1002",
    firstName: "Sara",
    lastName: "Adel",
    email: "sara.adel@rock.com",
    role: "Admin",
  },
  {
    id: "admin-1003",
    firstName: "Omar",
    lastName: "Khaled",
    email: "omar.khaled@rock.com",
    role: "Admin",
  },
  {
    id: "admin-1004",
    firstName: "Nour",
    lastName: "Hany",
    email: "nour.hany@rock.com",
    role: "Support",
  },
  {
    id: "admin-1005",
    firstName: "Laila",
    lastName: "Mostafa",
    email: "laila.mostafa@rock.com",
    role: "Admin",
  },
  {
    id: "admin-1006",
    firstName: "Karim",
    lastName: "Wael",
    email: "karim.wael@rock.com",
    role: "Support",
  },
  {
    id: "admin-1007",
    firstName: "Farah",
    lastName: "Ibrahim",
    email: "farah.ibrahim@rock.com",
    role: "Admin",
  },
  {
    id: "admin-1008",
    firstName: "Dina",
    lastName: "Ashraf",
    email: "dina.ashraf@rock.com",
    role: "Support",
  },
];
