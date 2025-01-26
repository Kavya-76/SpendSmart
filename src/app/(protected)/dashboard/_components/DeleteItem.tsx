import React from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Trash } from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'

interface DeleteItemProps{
    itemId: string;
    type: string;
}

const DeleteItem:React.FC<DeleteItemProps> = ({itemId, type}) => {
    const Type = type.charAt(0).toUpperCase()+type.slice(1);
    const deleteItem = async () => {
        try {
          await axios.delete("/api/delete-item",{
            params: {
                itemId,
                type
            }
          });
          toast.success(`${Type} deleted!`);
        } catch (error) {
          console.error("Error deleting: ", error);
        }
      };

  return (
    <div>
      <AlertDialog>
            <AlertDialogTrigger asChild>
              {/* <Button className="flex gap-2 rounded-full" variant="destructive"> */}
                <Trash className="h-8 w-8 items-center rounded-lg p-2 text-red-500 bg-red-500/10" />
              {/* </Button> */}
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your current budget along with expenses and remove your data
                  from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={deleteItem}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
    </div>
  )
}

export default DeleteItem
