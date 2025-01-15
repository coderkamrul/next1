'use client'

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

export function PreviewModal({ isOpen, onClose, children }) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className='max-w-[90vw] w-[90vw] h-[90vh]'>
        <DialogTitle>Preview</DialogTitle>
        <div className='mt-6 h-[calc(90vh-4rem)] overflow-auto'>{children}</div>
      </DialogContent>
    </Dialog>
  )
}
