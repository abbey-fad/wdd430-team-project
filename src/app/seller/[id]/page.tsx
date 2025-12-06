import SellerProfile from "../../../components/SellerProfile";

interface PageProps {
    params: Promise<{ id: string }>;
}

const PublicSellerProfilePage = async ({ params }: PageProps) => {
    const { id } = await params;
    return <SellerProfile profileId={id} />;
};

export default PublicSellerProfilePage;
