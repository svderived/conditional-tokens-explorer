import { BigNumber } from 'ethers/utils'
import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'

import { Button } from 'components/buttons'
import { Modal, ModalProps } from 'components/common/Modal'
import { Amount } from 'components/form/Amount'
import { ButtonContainer } from 'components/pureStyledComponents/ButtonContainer'
import { Row } from 'components/pureStyledComponents/Row'
import { ZERO_BN } from 'config/constants'
import { useWeb3ConnectedOrInfura } from 'contexts/Web3Context'
import { TransferOptions } from 'util/types'

const FirstRow = styled(Row)`
  padding-top: 12px;
`

const ButtonContainerStyled = styled(ButtonContainer)`
  margin-top: 100px;
`

interface Props extends ModalProps {
  positionId: string
  balance: BigNumber
  decimals: number
  onWrap: (transferValue: TransferOptions) => Promise<void>
  tokenSymbol?: string
}

export const WrapModal: React.FC<Props> = (props) => {
  const { WrapperService } = useWeb3ConnectedOrInfura()

  const { balance, decimals, onRequestClose, onWrap, positionId, tokenSymbol, ...restProps } = props

  const maxBalance = useMemo(() => (balance ? balance : ZERO_BN), [balance])

  const [amount, setAmount] = useState<BigNumber>(ZERO_BN)
  const amountChangeHandler = useCallback((value: BigNumber) => {
    setAmount(value)
  }, [])

  const useWalletHandler = useCallback(() => {
    if (maxBalance.gt(ZERO_BN)) {
      setAmount(maxBalance)
    }
  }, [maxBalance])

  const isSubmitDisabled = amount.isZero()

  const wrap = useCallback(
    (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.KeyboardEvent<HTMLInputElement>
    ) => {
      const wrapValues = {
        amount,
        address: WrapperService.address,
        positionId,
      }

      if (isSubmitDisabled) return

      onWrap(wrapValues)

      if (onRequestClose) onRequestClose(e)
    },
    [WrapperService, amount, isSubmitDisabled, onRequestClose, onWrap, positionId]
  )

  const onPressEnter = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') wrap(e)
    },
    [wrap]
  )

  return (
    <Modal
      onRequestClose={onRequestClose}
      style={{ content: { width: '500px' } }}
      title={'Wrap ERC1155'}
      {...restProps}
    >
      <FirstRow>
        <Amount
          amount={amount}
          autoFocus
          balance={maxBalance}
          decimals={decimals}
          isFromAPosition
          max={maxBalance.toString()}
          onAmountChange={amountChangeHandler}
          onKeyUp={onPressEnter}
          onUseWalletBalance={useWalletHandler}
          tokenSymbol={tokenSymbol}
        />
      </FirstRow>
      <ButtonContainerStyled>
        <Button disabled={isSubmitDisabled} onClick={wrap}>
          Wrap
        </Button>
      </ButtonContainerStyled>
    </Modal>
  )
}
