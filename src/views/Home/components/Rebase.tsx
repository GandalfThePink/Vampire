import React, { useCallback, useEffect, useState } from 'react'

import Countdown, { CountdownRenderProps} from 'react-countdown'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardIcon,
  Modal,
  ModalContent,
  ModalActions,
  Spacer,
} from 'react-neu'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'

import Dial from '../../../components/Dial'
import Label from '../../../components/Label'

import useVampire from '../../../hooks/useVampire'

import { getLastBloodRitual } from '../../../vampire-sdk/utils' // update name (seconds to next blood)


const Rebase: React.FC = () => {
  const vampire = useVampire()

  const [nextRebase, setNextRebase] = useState(0)
  const [rebaseWarningModal, setRebaseWarningModal] = useState(false)
  
  const { account } = useWallet()
  const fetchNextRebase = useCallback( async() => {
    if (!vampire) return
    const nextRebaseTimestamp = await getLastBloodRitual(vampire)
    if (nextRebaseTimestamp) {
      setNextRebase(Date.now() + nextRebaseTimestamp * 1000)
    } else {
      setNextRebase(Date.now())
    }
  }, [
    setNextRebase,
    vampire
  ])

  useEffect(() => {
    if (vampire) {
      fetchNextRebase()
    }
  }, [fetchNextRebase, vampire])

  const handleRebaseClick = useCallback(async () => {
    if (!vampire) return
    await vampire.contracts.vampire.methods.bloodRitual().send({ from: account, gas: 400000 })
  }, [account, vampire])

  const renderer = (countdownProps: CountdownRenderProps) => {
    const { hours, minutes, seconds } = countdownProps
    const paddedSeconds = seconds < 10 ? `0${seconds}` : seconds
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes
    const paddedHours = hours < 10 ? `0${hours}` : hours
    return (
      <span>{paddedHours}:{paddedMinutes}:{paddedSeconds}</span>
    )
  }

  const dialValue =  (1000 * 60 * 60  - nextRebase + Date.now()) / (1000 * 60 * 60) * 100

  return (
    <>
      <Card>
        <CardContent>
          <Box
            alignItems="center"
            justifyContent="center"
            row
          >
            <Dial size={196} value={dialValue}>
              <StyledCountdown>
                <StyledCountdownText>
                  {!nextRebase ? '--' : (
                    <Countdown date={new Date(nextRebase)} renderer={renderer} />
                  )}
                </StyledCountdownText>
                <Label text="Next Blood Ritual" />
              </StyledCountdown>
            </Dial>
          </Box>
          <Spacer />
          <Button
            disabled={!account || nextRebase > Date.now()}
			
            onClick={() => setRebaseWarningModal(true)}
            text={(!account || nextRebase > Date.now())?"Blood Ritual not ready yet":"Blood Ritual"}
            variant="secondary"
          />
        </CardContent>
      </Card>
      <Modal isOpen={rebaseWarningModal}>
        <CardIcon>⚠️</CardIcon>
        <ModalContent>
		 <div style={{display: 'flex', justifyContent: 'center'}}>	
		  🩸 WARNING: Only one blood ritual can suceed every hour 🩸
		 </div>	
		</ModalContent>
        <ModalActions>
          <Button
            onClick={() => setRebaseWarningModal(false)}
            text="Cancel"
            variant="secondary"
          />
          <Button
            onClick={handleRebaseClick}
            text="Confirm Blood Ritual"
          />
        </ModalActions>
      </Modal>
    </>
  )
}

const StyledCountdown = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`
const StyledCountdownText = styled.span`
  color: ${props => props.theme.colors.primary.main};
  font-size: 36px;
  font-weight: 700;
`

export default Rebase