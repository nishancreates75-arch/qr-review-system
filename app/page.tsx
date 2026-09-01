import ReviewPage from "@/components/ReviewPage";
import { businesses } from "@/data/businesses";

export default function Home() {
const business = businesses["abc-hotel"];

return <ReviewPage business={business} />;
}
