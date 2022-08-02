import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import { ModalActions, ModalInput } from 'src/components/Modal'
import { getFullDisplayBalance } from 'src/helpers/formatBalance'
import { Button, IconButton, MinusIcon, LinkExternal } from '@pancakeswap/uikit'
import Fade from '@material-ui/core/Fade';
import { Modal} from "@material-ui/core";
import Backdrop from '@material-ui/core/Backdrop';

import "./modal.scss";


interface WithdrawModalProps {
  max: number
  onConfirm: (amount: number) => void
  tokenName?: string
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({ onConfirm, max, tokenName = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const closeModal = () => { setIsOpen(false)}
  const openModal = () => {setIsOpen(true)}

  const [val, setVal] = useState(0)
  const [pendingTx, setPendingTx] = useState(false)

  const handleChange = (e:any) => {
    setVal(e.target.value);
    // console.log(val);
  };

  const handleSelectMax = useCallback(() => {
    setVal(max)
  }, [max, setVal])

  return (
    <div >
      <IconButton variant="tertiary" onClick={openModal} mr="6px">
        <MinusIcon color="primary" width="14px" />
      </IconButton>
      <Modal
        className="modal"         
        open={isOpen} 
        onClose={closeModal}  
        aria-labelledby="modal-modal-title" 
        aria-describedby="modal-modal-description" 
        disableScrollLock={false}
        BackdropComponent={Backdrop}
        closeAfterTransition
        BackdropProps={{
            timeout: 800,
        }}
      >
        <Fade in={isOpen}>
          <div className=' modal-content'> 
            <ModalInput
              onSelectMax={handleSelectMax}
              onChange={handleChange}
              value={val}
              max={max}
              symbol={tokenName}
              inputTitle={'SURF-BNB UNSTAKE'}
            />
              <ModalActions>
                <Button variant="secondary"  width="100%" onClick={closeModal} disabled={pendingTx}>
                  Cancel
                </Button>
                <Button
                  width="100%"
                  disabled={pendingTx || !val || val == 0 || val > max}
                  onClick={async () => {
                    setPendingTx(true)
                    try {
                      await onConfirm(val)
                    } catch (e) {
                      console.error(e)
                    } finally {
                      setPendingTx(false)
                    }
                  }}
                >
                  {pendingTx ? 'Pending Confirmation' : 'Confirm'}
              </Button>
            </ModalActions>
          </div>
        </Fade>
      </Modal>
    </div>
  )
}
