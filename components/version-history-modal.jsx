import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'

export function VersionHistoryModal({
  isOpen,
  onClose,
  versions,
  onSelectVersion,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Version History</DialogTitle>
        </DialogHeader>
        <ScrollArea className='mt-8 max-h-[60vh]'>
          {versions.map((version, index) => (
            <div
              key={version.id}
              className='flex justify-between items-center py-4'
            >
              <div>
                <h3 className='text-sm font-medium'>
                  Version {versions.length - index}
                </h3>
                <p className='text-sm text-gray-500'>
                  {new Date(version.createdAt).toLocaleString()}
                </p>
              </div>
              <Button onClick={() => onSelectVersion(version)}>Restore</Button>
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
