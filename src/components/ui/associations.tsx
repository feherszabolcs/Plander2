import { useEffect, useState } from 'react'
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "../ui/combobox"
import type IAssociation from '@/interfaces/IAssociation';
import { toast } from 'sonner';
import api from '@/lib/api';


const AssociationsComboBox = ({ field }: { field: any }) => {

    const [assocations, setAssociations] = useState<IAssociation[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const getAssociations = async () => {
        try {
            setIsLoading(true)
            const res = await api.get("/associations");
            if (res.status == 200)
                setAssociations(res.data)
        } catch (error: any) {
            toast.error("Nem sikerült lekérni az egyesületeket!", {
                description: error.message
            })
        }
        finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getAssociations()
    }, [])

    return (
        <Combobox
            items={assocations}
            value={field.value}
            onValueChange={(val) => field.onChange(val)}
            itemToStringLabel={(id) => assocations.find(a => a.id.toString() === id)?.name || ""}
        >
            <ComboboxInput
                placeholder="Válassza ki egyesületét"
            />

            <ComboboxContent>
                <ComboboxEmpty>Nincs találat</ComboboxEmpty>
                <ComboboxList>
                    {assocations.map((a) => (
                        <ComboboxItem
                            key={a.id}
                            value={a.id.toString()}
                        >
                            {a.name}
                        </ComboboxItem>
                    ))}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    )
}

export default AssociationsComboBox