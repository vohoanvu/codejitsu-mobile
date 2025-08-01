import { useEffect, useState } from 'react';
import { Card, H2, ScrollView, Spinner, Tabs, Text, YStack } from 'tamagui';
import { getAnalysisResult } from '../services/api-services';

interface Feedback {
    description: string;
    related_technique?: string;
    weakness_category?: string;
}

interface AnalysisResult {
    id: number;
    overallDescription: string;
    strengths: Feedback[];
    areasForImprovement: Feedback[];
}

const AnalysisResultScreen = ({ route }: any) => {
    const { videoId } = route.params;
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                setLoading(true);
                const response = await getAnalysisResult(videoId);
                setAnalysis(response.data);
            } catch (error) {
                console.error('Failed to fetch analysis', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalysis();
    }, [videoId]);

    if (loading) {
        return (
            <YStack flex={1} justifyContent="center" alignItems="center">
                <Spinner size="large" color="primary" />
                <Text>Loading analysis...</Text>
            </YStack>
        );
    }

    if (!analysis) {
        return <Text>Could not load analysis.</Text>;
    }

    return (
        <YStack flex={1} paddingTop="$8" paddingHorizontal="$4" backgroundColor="$background">
            <H2 color="$foreground">Analysis Result</H2>
            <Tabs defaultValue="summary"
                flexDirection="column"
                width="100%"
                height="100%"
                borderRadius="$4"
                borderWidth="$0.25"
                overflow="hidden"
                borderColor="$borderColor"
            >
                <Tabs.List>
                    <Tabs.Tab value="summary">
                        <Text>Summary</Text>
                    </Tabs.Tab>
                    <Tabs.Tab value="strengths">
                        <Text>Strengths</Text>
                    </Tabs.Tab>
                    <Tabs.Tab value="improvements">
                        <Text>Improvements</Text>
                    </Tabs.Tab>
                </Tabs.List>
                <Tabs.Content value="summary" paddingTop="$4">
                    <Card padding="$4" backgroundColor="$card">
                        <Text color="$foreground">{analysis.overallDescription}</Text>
                    </Card>
                </Tabs.Content>
                <Tabs.Content value="strengths" paddingTop="$4">
                    <ScrollView>
                        {analysis.strengths.map((item, index) => (
                            <Card key={index} padding="$4" marginBottom="$4" backgroundColor="$card">
                                <Text color="$foreground">{item.description}</Text>
                                {item.related_technique && <Text color="$muted">Related: {item.related_technique}</Text>}
                            </Card>
                        ))}
                    </ScrollView>
                </Tabs.Content>
                <Tabs.Content value="improvements" paddingTop="$4">
                    <ScrollView>
                        {analysis.areasForImprovement.map((item, index) => (
                            <Card key={index} padding="$4" marginBottom="$4" backgroundColor="$card">
                                <Text color="$foreground">{item.description}</Text>
                                {item.weakness_category && <Text color="$muted" fontSize="$2" marginTop="$2">{item.weakness_category}</Text>}
                                {item.related_technique && <Text color="$muted" fontSize="$2">Related: {item.related_technique}</Text>}
                            </Card>
                        ))}
                    </ScrollView>
                </Tabs.Content>
            </Tabs>
        </YStack>
    );
};

export default AnalysisResultScreen;
