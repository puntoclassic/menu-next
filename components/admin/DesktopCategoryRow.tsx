import AdminDeleteButton from "@/components/admin/AdminDeleteButton";
import AdminEditButton from "@/components/admin/AdminEditButton";
import { Category } from "@/src/types";


export default function DesktopCategoryRow(props: { category: Category }) {
    const { category } = props;
    return <>
        <div className="hidden lg:flex w-full flex-row flex-grow">
            <div className="w-1/12 text-center flex items-center justify-center">
                {category.id}
            </div>
            <div className="w-8/12 text-left flex items-center">{category.name}</div>
            <div className="w-3/12 text-center flex flex-row space-x-2 items-center content-center justify-center">
                <AdminEditButton link={`/amministrazione/catalogo/categorie/modifica/${category.id}`}></AdminEditButton>
                <AdminDeleteButton link={`/amministrazione/catalogo/categorie/elimina/${category.id}`}></AdminDeleteButton>
            </div>
        </div>
    </>
}
