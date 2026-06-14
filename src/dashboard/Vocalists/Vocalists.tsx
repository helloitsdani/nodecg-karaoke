import { useReplicant } from "@nodecg/react-hooks"

import type { Vocalist } from "../../types"
import VocalistsForm from "./VocalistsForm"

const Vocalists = () => {
  const [vocalists, setVocalists] = useReplicant<Vocalist[]>("vocalists")

  return (
    <VocalistsForm vocalists={vocalists} onUpdateVocalists={setVocalists} />
  )
}

export default Vocalists
