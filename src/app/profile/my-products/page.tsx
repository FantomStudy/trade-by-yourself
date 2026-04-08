import { EditIcon, EyeIcon, Trash2Icon } from "lucide-react";
import { getCurrentUser } from "@/api/auth";
import { getUserProducts } from "@/api/products";
import { ProductCard } from "@/components/ProductCard";
import { Button, Grid } from "@/components/ui";

const MyProductsPage = async () => {
  const user = await getCurrentUser();
  const products = await getUserProducts(user.id);

  // if (!products) {
  //   return (
  //     <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg bg-white p-8 text-center shadow-sm">
  //       <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
  //         <Package className="h-10 w-10 text-red-500" />
  //       </div>
  //       <h3 className="mb-2 text-xl font-semibold text-gray-800">Ошибка загрузки</h3>
  //       <p className="text-gray-600">Не удалось загрузить ваши объявления</p>
  //     </div>
  //   );
  // }

  // if (products.length === 0) {
  //   return (
  //     <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg bg-white p-8 text-center shadow-sm">
  //       <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
  //         <Package className="h-10 w-10 text-green-500" />
  //       </div>
  //       <h3 className="mb-2 text-xl font-semibold text-gray-800">У вас пока нет объявлений</h3>
  //       <p className="mb-4 text-gray-600">
  //         Создайте свое первое объявление, чтобы начать продавать
  //       </p>
  //       <Link
  //         href="/profile/create-product"
  //         className="rounded-lg bg-blue-500 px-6 py-2 text-white transition-colors hover:bg-blue-600"
  //       >
  //         Создать объявление
  //       </Link>
  //     </div>
  //   );
  // }

  return (
    <Grid>
      {products.map((product) => (
        <ProductCard key={product.id} product={product}>
          <div>
            <Button>
              <EyeIcon />
            </Button>
            <Button>
              <EditIcon />
            </Button>
            <Button>
              <Trash2Icon />
            </Button>
          </div>
        </ProductCard>
      ))}
    </Grid>
  );
};

export default MyProductsPage;
