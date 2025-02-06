import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Loading from "@/components/Loading";

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      );
      return response.data;
    }
  });

  const filteredAndSortedUsers = users
    ?.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => (a[sortBy] > b[sortBy] ? 1 : -1));

  if (isLoading) return <Loading />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:max-w-sm"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full sm:w-auto p-2 border rounded"
          >
            <option value="name">Sort by Name</option>
            <option value="email">Sort by Email</option>
          </select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0 sm:p-6">
          <div className="relative w-full overflow-auto">
            <div className="max-w-[90vw] overflow-x-scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="bg-background min-w-[200px]">Name</TableHead>
                    <TableHead className="min-w-[200px]">Email</TableHead>
                    <TableHead className="min-w-[150px]">City</TableHead>
                    <TableHead className="min-w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedUsers?.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="bg-background whitespace-nowrap">
                        {user.name}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{user.email}</TableCell>
                      <TableCell className="whitespace-nowrap">{user.address.city}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="whitespace-nowrap">
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-[90vw] sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>{user.name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-2">
                              <p>
                                <strong>Email:</strong> {user.email}
                              </p>
                              <p>
                                <strong>Phone:</strong> {user.phone}
                              </p>
                              <p>
                                <strong>Website:</strong> {user.website}
                              </p>
                              <p>
                                <strong>Company:</strong> {user.company.name}
                              </p>
                              <p>
                                <strong>Address:</strong>{" "}
                                {`${user.address.street}, ${user.address.suite}, ${user.address.city}, ${user.address.zipcode}`}
                              </p>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;
