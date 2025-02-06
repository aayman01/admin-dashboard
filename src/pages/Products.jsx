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
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Loading from "@/components/Loading";

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newlyAddedProductId, setNewlyAddedProductId] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    data: {
      color: "",
      price: "",
      capacity: ""
    },
  });
  const [selectedProduct, setSelectedProduct] = useState(null);

  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await axios.get("https://api.restful-api.dev/objects");
      return response.data;
    },
  });

  const {
    data: singleProduct,
    isLoading: isSingleProductLoading,
    error: singleProductError,
  } = useQuery({
    queryKey: ["product", selectedProduct],
    queryFn: async () => {
      if (!selectedProduct) return null;
      const response = await axios.get(`https://api.restful-api.dev/objects/${selectedProduct}`);
      return response.data;
    },
    enabled: !!selectedProduct,
  });

  const {
    data: newlyAddedProduct,
    isLoading: isNewProductLoading,
  } = useQuery({
    queryKey: ["newProduct", newlyAddedProductId],
    queryFn: async () => {
      if (!newlyAddedProductId) return null;
      const response = await axios.get(`https://api.restful-api.dev/objects/${newlyAddedProductId}`);
      return response.data;
    },
    enabled: !!newlyAddedProductId,
  });

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const response = await axios.post("https://api.restful-api.dev/objects", newProduct);
      setNewlyAddedProductId(response.data.id);
      setIsCreateDialogOpen(false);
      setNewProduct({
        name: "",
        data: {
          color: "",
          price: "",
          capacity: "",
        },
      });
    } catch (error) {
      console.error("Failed to create product:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`https://api.restful-api.dev/objects/${id}`);
      setNewlyAddedProductId(null);
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const allProducts = newlyAddedProduct 
    ? [newlyAddedProduct, ...(products || [])]
    : products;

  const filteredAndSortedProducts = allProducts
    ?.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "data.price") {
        const priceA = parseFloat(a.data?.price) || 0;
        const priceB = parseFloat(b.data?.price) || 0;
        return priceA - priceB;
      }
      return 0;
    });

  const formatCapacity = (data) => {
    if (!data) return "N/A";
    if (data["capacity GB"]) return `${data["capacity GB"]} GB`;
    if (data.Capacity) return data.Capacity;
    return "N/A";
  };

  const formatPrice = (data) => {
    if (!data) return "N/A";
    if (data.price) return `$${data.price}`;
    return "N/A";
  };

  const formatColor = (data) => {
    if (!data) return "N/A";
    if (data.color) return data.color;
    if (data.Color) return data.Color;
    if (data["Strap Colour"]) return data["Strap Colour"];
    return "N/A";
  };

  if (isLoading) return <Loading />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Input
            type="text"
            placeholder="Search products..."
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
            <option value="data.price">Sort by Price</option>
          </select>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">Add Product</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Product</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  value={newProduct.data.color}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      data: { ...newProduct.data, color: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={newProduct.data.price}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      data: {
                        ...newProduct.data,
                        price: parseFloat(e.target.value),
                      },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  value={newProduct.data.capacity}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      data: { ...newProduct.data, capacity: e.target.value },
                    })
                  }
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? "Creating..." : "Create Product"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {isNewProductLoading && newlyAddedProductId && (
        <div className="bg-green-50 p-4 rounded-md">
          <p className="text-green-700">Loading newly added product...</p>
        </div>
      )}
      {newlyAddedProduct && (
        <Card className="bg-green-50 mb-4">
          <CardContent className="p-0 sm:p-6">
            <h3 className="font-semibold my-2 px-6 pt-6">Newly Added Product:</h3>
            <div className="relative w-full overflow-auto">
              <div className="max-w-[90vw] overflow-x-scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="sticky left-0 bg-green-50 min-w-[200px]">Name</TableHead>
                      <TableHead className="min-w-[150px]">Color</TableHead>
                      <TableHead className="min-w-[150px]">Capacity</TableHead>
                      <TableHead className="min-w-[150px]">Price</TableHead>
                      <TableHead className="min-w-[120px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="sticky left-0 bg-green-50">{newlyAddedProduct.name}</TableCell>
                      <TableCell className="whitespace-nowrap">{formatColor(newlyAddedProduct.data)}</TableCell>
                      <TableCell className="whitespace-nowrap">{formatCapacity(newlyAddedProduct.data)}</TableCell>
                      <TableCell className="whitespace-nowrap">{formatPrice(newlyAddedProduct.data)}</TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          onClick={() => handleDeleteProduct(newlyAddedProduct.id)}
                          className="whitespace-nowrap"
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      <Card>
        <CardContent className="p-0 sm:p-6">
          <div className="relative w-full overflow-auto">
            <div className="max-w-[90vw] overflow-x-scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="bg-background min-w-[200px]">Name</TableHead>
                    <TableHead className="min-w-[150px]">Color</TableHead>
                    <TableHead className="min-w-[150px]">Capacity</TableHead>
                    <TableHead className="min-w-[150px]">Price</TableHead>
                    <TableHead className="min-w-[120px]">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedProducts?.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="left-0 bg-background">{product.name}</TableCell>
                      <TableCell className="whitespace-nowrap">{formatColor(product.data)}</TableCell>
                      <TableCell className="whitespace-nowrap">{formatCapacity(product.data)}</TableCell>
                      <TableCell className="whitespace-nowrap">{formatPrice(product.data)}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              onClick={() => setSelectedProduct(product.id)}
                              className="whitespace-nowrap"
                            >
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-[90vw] sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>
                                {isSingleProductLoading
                                  ? "Loading..."
                                  : singleProduct?.name}
                              </DialogTitle>
                            </DialogHeader>
                            {isSingleProductLoading ? (
                              <div>Loading product details...</div>
                            ) : singleProductError ? (
                              <div>Error loading product details</div>
                            ) : (
                              <div className="space-y-2">
                                <p>
                                  <strong>ID:</strong> {singleProduct?.id}
                                </p>
                                <p>
                                  <strong>Color:</strong>{" "}
                                  {formatColor(singleProduct?.data)}
                                </p>
                                <p>
                                  <strong>Capacity:</strong>{" "}
                                  {formatCapacity(singleProduct?.data)}
                                </p>
                                <p>
                                  <strong>Price:</strong>{" "}
                                  {formatPrice(singleProduct?.data)}
                                </p>
                                {singleProduct?.data?.generation && (
                                  <p>
                                    <strong>Generation:</strong>{" "}
                                    {singleProduct.data.generation}
                                  </p>
                                )}
                                {singleProduct?.data?.["Screen size"] && (
                                  <p>
                                    <strong>Screen Size:</strong>{" "}
                                    {singleProduct.data["Screen size"]}
                                  </p>
                                )}
                                {singleProduct?.data?.Description && (
                                  <p>
                                    <strong>Description:</strong>{" "}
                                    {singleProduct.data.Description}
                                  </p>
                                )}
                              </div>
                            )}
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

export default Products;