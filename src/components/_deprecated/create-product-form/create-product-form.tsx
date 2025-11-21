// "use client";
// import type { SubmitHandler } from "react-hook-form";

// import type { CreateProductData } from "@/api/types";
// import type { Category } from "@/types";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useState } from "react";
// import { Controller, useForm } from "react-hook-form";

// import { createProductSchema } from "@/api/types";

// import {
//   Button,
//   Input,
//   RadioGroup,
//   RadioGroupItem,
//   Textarea,
//   Typography,
// } from "../ui";

// import styles from "./create-product-form.module.css";

// const productStates = [
//   { label: "Новое", value: "NEW" },
//   { label: "Б/У", value: "USED" },
// ];

// interface CreateProductFormProps {
//   categories: Category[];
// }

// export const CreateProductForm = ({ categories }: CreateProductFormProps) => {
//   const {
//     register,
//     handleSubmit,
//     control,
//     getValues,
//     formState: { errors, isSubmitting },
//   } = useForm({
//     resolver: zodResolver(createProductSchema),
//   });
//   const [error, setError] = useState<string>();

//   const selectedCategory = categories.find(
//     (c) => c.id === Number(getValues("categoryId")),
//   );
//   const subCategories = selectedCategory?.subCategories ?? [];

//   const selectedSubcategory = subCategories.find(
//     (s) => s.id === Number(getValues("subcategoryId")),
//   );
//   const types = selectedSubcategory?.subcategoryTypes ?? [];

//   const selectedType = types.find((t) => t.id === Number(getValues("typeId")));
//   const dynamicFields = selectedType?.fields ?? [];

//   const onSubmit: SubmitHandler<CreateProductData> = async (formData) => {};

//   return (
//     <form onSubmit={handleSubmit(onSubmit)}>
//       <Input {...register("name")} placeholder="Название объявления" />
//       <Input
//         {...register("price")}
//         pattern="[0-9]*"
//         inputMode="numeric"
//         placeholder="Цена"
//       />
//       <Textarea
//         {...register("description")}
//         placeholder="Описание товара"
//         rows={5}
//       />

//       <Controller
//         render={({ field, fieldState }) => (
//           <div>
//             <Typography variant="h2">Выберите тип товара*</Typography>
//             <RadioGroup
//               aria-invalid={fieldState.invalid}
//               name={field.name}
//               value={field.value}
//               onValueChange={field.onChange}
//             >
//               {productStates.map((state) => (
//                 <div key={state.value}>
//                   <RadioGroupItem
//                     aria-invalid={fieldState.invalid}
//                     id={`form-radio-${state.value}`}
//                     value={state.value}
//                   />
//                   <label htmlFor={`form-radio-${state.value}`}>
//                     {state.label}
//                   </label>
//                 </div>
//               ))}
//             </RadioGroup>
//           </div>
//         )}
//         name="state"
//         control={control}
//       />

//       <Controller
//         render={({ field }) => (
//           <select 
//             className="w-full rounded border border-gray-300 bg-white p-2"
//             name={field.name}
//             value={field.value}
//             onChange={field.onChange}
//           >
//             <option value="">Выберите категорию</option>
//             {categories.map((category) => (
//               <option key={category.id} value={category.id}>
//                 {category.name}
//               </option>
//             ))}
//           </select>
//         )}
//         name="categoryId"
//         control={control}
//       />

//       <Controller
//         render={({ field }) => (
//           <select
//             className="w-full rounded border border-gray-300 bg-white p-2"
//             disabled={!selectedCategory}
//             name={field.name}
//             value={field.value}
//             onChange={field.onChange}
//           >
//             <option value="">Выберите подкатегорию</option>
//             {subCategories.map((subcategory) => (
//               <option key={subcategory.id} value={subcategory.id}>
//                 {subcategory.name}
//               </option>
//             ))}
//           </select>
//         )}
//         name="subcategoryId"
//         control={control}
//       />

//       <Controller
//         render={({ field }) => (
//           <select
//             className="w-full rounded border border-gray-300 bg-white p-2"
//             disabled={!selectedSubcategory}
//             name={field.name}
//             value={field.value}
//             onChange={field.onChange}
//           >
//             <option value="">Выберите тип</option>
//             {types.map((type) => (
//               <option key={type.id} value={type.id}>
//                 {type.name}
//               </option>
//             ))}
//           </select>
//         )}
//         name="typeId"
//         control={control}
//       />

//       {error && <span className={styles.error}>{error}</span>}

//       <Button className={styles.button} disabled={isSubmitting} type="submit">
//         Создать объявление
//       </Button>
//     </form>
//   );
// };
